import { CsvRow, arrayOr as rowArrayOr, arrayAnd as rowArrayAnd } from "./CsvRow";
import Query from "./Query";

class Parser {

    parseQuery = async (query: string, filePath: string) => {
        const tokens = query.split(/\s+(or|and)\s+/);
        if (tokens.length % 2 === 0) {
            throw Error('Predicates and Conditions mismatch');
        }

        let results: CsvRow[] = [];

        for (let i = 0; i < tokens.length; i++) {
            if (i % 2 === 0) {                   // If Condition, not 'and' nor 'or'
                const subResults = await this.parseCondition(tokens[i], filePath);
                if (i == 0)                      // For the 1st condition
                    results = subResults
                else
                    results = tokens[i - 1] === 'and' ? rowArrayAnd(results, subResults) :
                        rowArrayOr(results, subResults)
            }
        }

        if (results.length !== 0) {
            Query.saveCSV(results, 'output.csv')
        }

        return results
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
            throw Error(`Quotes doesn't match at ${condition}`);
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