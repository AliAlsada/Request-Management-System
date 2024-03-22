import { db } from "../database/db.js";

interface InspectionRequestParams {
    requestId: number;
    inspectionDate: string;
    inspectionTime: string;
    inspectionType: string; 
}

export async function insertInspectionRequest(params: InspectionRequestParams) {
    
    const {requestId, inspectionDate, inspectionTime, inspectionType} = params

    const InspectionRequestQuery = `INSERT INTO InspectionRequest 
                (RequestID, InspectionDate, InspectionTime, InspectionType) 
                VALUES (?, ?, ?, ?)`;

    const prepareQuery = db.prepare(InspectionRequestQuery);

    try {
        prepareQuery.run(requestId, inspectionDate, inspectionTime, inspectionType)
    } catch (error) {
        console.log(error)
        // console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}