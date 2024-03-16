import { db } from "../database/db.js";
  
interface insertRequestParams {
    RequestID: number;
    RequestType: number;
    RequestStatus: number;
    CompanyName: string;
}

export async function insertRequest(params: insertRequestParams) {
    
    const {RequestID, RequestType, RequestStatus, CompanyName} = params
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


