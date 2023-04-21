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
            '&=': (row) => row[left].includes(right)
        }

        const operationStar: StringToFuncMap = {
            '==': (row) => Object.values(row).includes(right),
            '!=': (row) => !Object.values(row).includes(right),
            '$=': (row) => Object.values(row).some(value => value.toLowerCase() === right.toLowerCase()),
            '&=': (row) => Object.values(row).some(value => value.includes(right))
        }

        const rows: CsvRow[] = [];
        const stream = fs.createReadStream(filePath).pipe(csv());

        for await (const row of stream) {
            rows.push(row);
        }

        const filteredRows = rows.filter(left === '*' ? operationStar[op] : operation[op]);

        return filteredRows;

    }

    saveCSV = (rows: CsvRow[], filePath: string) => {

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: Object.keys(rows[0]).map((key) => ({ id: key, title: key })),
        });

        csvWriter.writeRecords(rows)
            .then(() => console.log('The CSV file was written successfully.'))
            .catch((error) => console.error(error));
    }

}

export default new Query();