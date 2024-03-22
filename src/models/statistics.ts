import { db } from "../database/db.js";

interface CountRowsInterface {
    [key: string]: number;
  }

export async function countRows() {

    let tables:CountRowsInterface = {
        "Requests": 0, 
        "AccountRequest": 0, 
        "NewLicense": 0, 
        "InspectionRequest": 0, 
        "AddActivity": 0, 
        "StampLicense": 0,
    }

    for (const table in tables){
        // Query to count the number of rows in a table
        const countQuery = `SELECT COUNT(*) AS rowCount FROM ${table}`;
        try {
          const result:any = db.query(countQuery).get();
          const rowsCount = Number(result["rowCount"])
          tables[table] = rowsCount;
        } catch (error) {
          console.error(`Error counting rows in ${table}:`, error);
          return -1; // Indicates an error
        }
    }

    //return the object that contains the number of rows for each table
    return tables
}

