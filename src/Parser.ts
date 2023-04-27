import { CsvRow, arrayOr as rowArrayOr, arrayAnd as rowArrayAnd } from "./CsvRow";
import Query from "./Query";

class Parser {

    parseQuery = async (query: string, filePath: string) => {

        const conditions = query.split(/and|or/).filter(str => str.trim() !== '');
        const operators = query.match(/and|or/g);

        console.log(conditions);
        console.log(operators);


        if (!operators && conditions.length > 1 || operators && (operators.length !== conditions.length - 1)) {
            throw Error('Predicates and Conditions mismatch');
        }

        let allResults: CsvRow[][] = [];

        for (const condition of conditions) {
            allResults.push(await this.parseCondition(condition, filePath));
        }

        let results: CsvRow[] = allResults[0];

        console.log(allResults)

        if (operators) {
            for (let i = 0; i < operators.length; i++) {
                results = operators[i] === 'and' ?
                    rowArrayAnd(results, allResults[i + 1]) : rowArrayOr(results, allResults[i + 1]);
            }
        }

        if (results.length === 0) {
            throw Error('No results found');
        }

        Query.saveCSV(results, 'output.csv');

        return results;
    }

    parseCondition = async (condition: string, filePath: string) => {

        const matchCondition = /^\s*(.+)\s*(==|!=|&=|\$=)\s*(.+)\s*$/;

        const matchC = matchCondition.exec(condition)

        if (!matchC) {
            throw Error(`Invalid Condition at ${condition}`);
        }

        const [, left, op, right] = matchC;

        const matchQuotes = /^\s*"(.*)"\s*$/;
        const matchQ = right.match(matchQuotes);
        if (!matchQ) {
            throw Error(`Quotes don't match at ${condition}`);
        }

        const rightNew = matchQ[1]

        if (left.trim() !== '*') {
            const matchLetterOrDigit = /^[a-zA-Z0-9]+$/;
            const matchLD = left.trim().match(matchLetterOrDigit);
            if (!matchLD) {
                throw Error(`Condition Column is invalid at ${condition}`);
            }
        }

        const res = await Query.queryCSV(left.trim(), op, rightNew.trim(), filePath);
        return res;
    }

}


export default new Parser()