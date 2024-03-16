import { db } from "../database/db.js";

interface NewLicenseRequestParams {
    requestId: number;
    requesterName: string;
    applicantName: boolean;
    userName: string;
    contactEmail: string; 
}

export async function insertAccountRequest(params: NewLicenseRequestParams) {
    const {requestId, requesterName, applicantName, userName, contactEmail} = params

    const insertAccountQuery = `INSERT INTO AccountRequest 
                (RequestID, RequesterName, ApplicantName, UserName, ContactEmail) 
                VALUES (?, ?, ?, ?, ?)`;

    const prepareQuery = db.prepare(insertAccountQuery);

    try {
        prepareQuery.run(requestId, requesterName, applicantName, userName, contactEmail)
    } catch (error) {
        // console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}