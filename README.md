# CSV Query



## How to start

Install dependencies
```bash
$ npm install
```

Run server
```bash
$ npm run start
```



## How to call API

URL: https://localhost:5001/

METHOD: GET

BODY: JSON, add query string and target file path, example:

```
{
    "query" : "C1 == \"A\"",
    "filePath" : "query.csv"
}
```



## Code Structure
- index.ts

*Entry point.*


- Parser.ts

*Parse query string and every condition in it. Return query results.*


- Qurey.ts

*Query the target file and save query results into output.csv file.*


- CsvRow.ts

  *Util file, deal with csv file rows.*



## TODO
Due to time limit, there are some limitations of current solution:
- The priority of predicates **and** , **or** is not yet considered

