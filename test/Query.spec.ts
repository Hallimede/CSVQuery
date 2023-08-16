import { describe } from "node:test";
import Parser from "../src/Parser";
import { CsvRow } from "../src/CsvRow";
import { expect } from '@jest/globals';


describe('Query Test', () => {

    const res1 = { "C1": "A", "C2": "B", "C3": "Value 1" };
    const res2 = { "C1": "A", "C2": "C", "C3": "Value 2" };
    const res3 = { "C1": "B", "C2": "C", "C3": "Value 3" };

    const filePath = 'query.csv';

    it('tests a single condition with results', async () => {
        let results: CsvRow[] = await Parser.parseQuery('C1 == "A"', filePath);
        expect(results.length).toBe(2);

        expect(results).toContainEqual(res1);
        expect(results).toContainEqual(res2);
    })

    it('tests a condition with no results', async () => {
        try {
            await Parser.parseQuery('C1 == "A1"', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toStrictEqual('No results found');
        }
    })

    it('tests two conditions with results, or', async () => {
        let results: CsvRow[] = await Parser.parseQuery('C1 == "B" or C2 $= "c"', filePath);
        expect(results.length).toBe(2);
        expect(results).toContainEqual(res2);
        expect(results).toContainEqual(res3);
    })

    it('tests three conditions with results, and', async () => {
        let results: CsvRow[] = await Parser.parseQuery('C2 == "C" and C3 &= "Value" and C1 != "A"', filePath);
        expect(results.length).toBe(1);
        expect(results).toContainEqual(res3);
    })

    it('tests number of conditions and predicates mismatch', async () => {
        try {
            await Parser.parseQuery('C1 == "B" or C2 $= "c" and', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toStrictEqual('Predicates and Conditions mismatch');
        }
    })

    it('tests invalid conditions with operators', async () => {
        try {
            await Parser.parseQuery('C1 = "B" or C2 $= "c"', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('Invalid Condition');
        }
    })

    it('tests invalid conditions with missing parts', async () => {
        try {
            await Parser.parseQuery('== "B" or C2 $= "c"', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('Invalid Condition');
        }
    })

    it('tests invalid conditions with missing quotes', async () => {
        try {
            await Parser.parseQuery('C1 == "B or C2 $= "c"', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('Quotes don\'t match');
        }
    })

    it('tests invalid conditions with invalid column names', async () => {
        try {
            await Parser.parseQuery('"C1" == "B" or C2 $= "c"', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('Condition Column is invalid');
        }
    })

    it('tests querying all columns', async () => {
        let results: CsvRow[] = await Parser.parseQuery('* == "B" and * &= "Value"', filePath);
        expect(results.length).toBe(2);
        expect(results).toContainEqual(res1);
        expect(results).toContainEqual(res3);

        let results2: CsvRow[] = await Parser.parseQuery('* != "A" and * $= "c"', filePath);
        expect(results2.length).toBe(1);
        expect(results2).toContainEqual(res3);
    })

    it('tests not existing columns', async () => {
        try {
            await Parser.parseQuery('C4 == "B" or C2 $= "c"', filePath);
        } catch (e: any) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('Querying csv file error');
        }
    })

})