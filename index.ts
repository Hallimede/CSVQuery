import express, { Express, Request, Response } from 'express';
import Parser from './Parser';
import bodyParser from 'body-parser';

const app: Express = express();
app.use(bodyParser.json());

const port = 5001;

app.get('/', async (req: Request, res: Response) => {
    try {
        const { query, filePath } = req.body;
        const results = await Parser.parseQuery(query, filePath);
        console.log(results);
        res.send(results);
    } catch (error: any) {
        console.log(error.message);
        res.status(400).send({ message: error.message });  
    }
});

app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
