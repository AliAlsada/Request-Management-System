import { db } from "../database/db.js";
  
export async function insertRequest(RequestID: number, RequestType: number, RequestStatus: number, CompanyName: string) {

    const insertRequestQuery = `INSERT INTO Requests 
                (RequestID, RequestType, RequestStatus, CompanyName) 
                VALUES (?, ?, ?, ?)`;

    const prepareQuery = db.prepare(insertRequestQuery);

    try {
        prepareQuery.run(RequestID, RequestType, RequestStatus, CompanyName)
    } catch (error) {
        console.log(`[CONSTRAIN ERROR] ${RequestID} already exists in the database`)
    }
    
}


