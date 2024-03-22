import { db } from "../database/db.js";
  
interface insertRequestParams {
    requestId: number;
    requestType: number;
    requestStatus: number;
    companyName: string;
}

export async function insertRequest(params: insertRequestParams) {
    
    const {requestId, requestType, requestStatus, companyName} = params
    const insertRequestQuery = `INSERT INTO Requests 
                (RequestID, RequestType, RequestStatus, CompanyName) 
                VALUES (?, ?, ?, ?)`;

    const prepareQuery = db.query(insertRequestQuery);

    try {
        prepareQuery.run(requestId, requestType, requestStatus, companyName)
        return true;
    } catch (error) {
        console.log(error)
        return false;
        // console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}


