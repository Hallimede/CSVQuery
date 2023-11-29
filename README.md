# CSV Query 

This project is a CSV file query tool built with Node.js and Express. It allows you to perform queries on CSV files and get the results in a structured format. The queries are performed using a custom query language that supports basic comparison operators and logical operators.

## How To Start

1. Install dependencies


    ```bash
    $ npm install
    ```

2. Run server

    ```bash
    $ npm run start
    ```


## How To Call API

- URL: https://localhost:5001/

- METHOD: GET

- BODY: JSON, add query string and target file path, example:

    ```json
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

- Query.ts

    *Query the target file and save query results into output.csv file.*

- CsvRow.ts

    *Util file, deal with csv file rows.*

## Design Considerations

1. Used regex (regular expressions), which is a powerful tool for manipulating and searching for patterns in text.

2. Customized CSVRow equal method, CSVRow array AND and array OR methods, to address multiple-condition problems

## Testing

- The project uses Jest for testing. Run the tests with `npm run test`.
