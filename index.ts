import express, { Express, Request, Response } from 'express';
import Parser from './src/Parser';
import bodyParser from 'body-parser';

const app: Express = express();
app.use(bodyParser.json());

const port = 5001;

app.get('/', async (req: Request, res: Response) => {
    try {
        const { query, filePath } = req.body;
        if (!query) throw new Error("Missing query");
        if (!filePath) throw new Error("Missing file path");
        const results = await Parser.parseQuery(query, filePath);
        console.log(results)
        res.send(results);
    } catch (error: any) {
        console.log(error.message);
        res.status(400).send({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
