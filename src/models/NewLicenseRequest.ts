import { db } from "../database/db.js";

interface NewLicenseRequestParams {
    requestId: number;
    licenceType: string;
    isOffice: boolean;
    officeName: string;
    officeServiceNumber: string; 
    requestDate: string;
}

export async function insertNewLicenseRequest(params: NewLicenseRequestParams) {
    
    const {requestId, licenceType, isOffice, officeName, officeServiceNumber, requestDate} = params

    const insertNewLicenseQuery = `INSERT INTO NewLicense 
                (RequestID, LicenseType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    const prepareQuery = db.prepare(insertNewLicenseQuery);

    try {
        prepareQuery.run(requestId, licenceType, isOffice, officeName, officeServiceNumber, requestDate)
    } catch (error) {
        console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}