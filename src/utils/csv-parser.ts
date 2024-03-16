import { parseString } from 'fast-csv';

export function parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        let rows: any[] = [];
        parseString(content, { headers: true })
            .on('error', error => reject(error))
            .on('data', row => rows.push(row))
            .on('end', () => resolve(rows));
    });
}