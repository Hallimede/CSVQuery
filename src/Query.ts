import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { CsvRow } from './CsvRow';


type StringToFuncMap = {
    [key: string]: (row: CsvRow) => boolean;
};

class Query {

    queryCSV = async (left: string, op: string, right: string, filePath: string) => {

        const operation: StringToFuncMap = {
            '==': (row) => row[left] === right,
            '!=': (row) => row[left] !== right,
            '$=': (row) => row[left].toLowerCase() === right.toLowerCase(),
            '&=': (row) => { console.log('&&&', row, row[left], left); return row[left].includes(right) }
        };

        const operationStar: StringToFuncMap = {
            '==': (row) => Object.values(row).includes(right),
            '!=': (row) => !Object.values(row).includes(right),
            '$=': (row) => Object.values(row).some(value => value.toLowerCase() === right.toLowerCase()),
            '&=': (row) => Object.values(row).some(value => value.includes(right))
        };

        const rows: CsvRow[] = [];

        try {
            const stream = fs.createReadStream(filePath).pipe(csv());
            for await (const row of stream) {
                rows.push(row);
            }
        } catch (e: any) {
            throw new Error('Reading csv file error' + e.message);
        }

        let filteredRows;

        try {
            filteredRows = rows.filter(left === '*' ? operationStar[op] : operation[op]);
        } catch (e: any) {
            throw new Error('Querying csv file error' + e.message);
        }

        return filteredRows;
    }

    saveCSV = (rows: CsvRow[], filePath: string) => {

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: Object.keys(rows[0]).map((key) => ({ id: key, title: key })),
        });

        csvWriter.writeRecords(rows)
            // .then(() => console.log('The CSV file was written successfully.'))
            .catch((error) => { throw new Error('Writing csv file error' + error.message) });
    }

}

export default new Query();