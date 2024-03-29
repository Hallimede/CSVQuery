export interface CsvRow {
    [key: string]: string;
}

export const arrayAnd = (rowsA: CsvRow[], rowsB: CsvRow[]) => {
    return rowsA.filter(rowA => rowsB.some(rowB => rowEquals(rowA, rowB)))
}

export const arrayOr = (rowsA: CsvRow[], rowsB: CsvRow[]) => {
    const tmp = rowsB.filter(rowB => rowsA.every(rowA => !rowEquals(rowA, rowB)))
    return rowsA.concat(tmp)
}

export const rowEquals = (rowA: CsvRow, rowB: CsvRow) => {
    if (rowA === rowB) {
        return true;
    } 

    const keys1 = Object.keys(rowA);
    const keys2 = Object.keys(rowB);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i];
        if (!rowB.hasOwnProperty(key) || !(rowA[key] === rowB[key])) {
            return false;
        }
    }

    return true;
}