import { db } from "../database/db.js";
  
interface insertStampParams {
    requestId: number;
    licenseId: string;
    requestDate: string;
}

export async function insertStampLicenseRequest(params: insertStampParams) {
    
    const {requestId, licenseId, requestDate} = params
    const insertStampLicensetQuery = `INSERT INTO StampLicense 
                (RequestID, LicenseID, RequestDate) 
                VALUES (?, ?, ?)`;

    const prepareQuery = db.query(insertStampLicensetQuery);

    try {
        prepareQuery.run(requestId, licenseId, requestDate)
    } catch (error) {
        console.log(error)
        // console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}


