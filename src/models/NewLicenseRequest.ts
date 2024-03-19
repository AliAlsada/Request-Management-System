import { db } from "../database/db.js";

interface NewLicenseRequestParams {
    requestId: number;
    licenseType: string;
    isOffice: boolean;
    officeName: string;
    officeServiceNumber: string; 
    requestDate: string;
    activities: string;
}

export async function insertNewLicenseRequest(params: NewLicenseRequestParams) {
    
    const {requestId, licenseType, isOffice, officeName, officeServiceNumber, requestDate, activities} = params

    const insertNewLicenseQuery = `INSERT INTO NewLicense 
                (RequestID, LicenseType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate, Activities) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const prepareQuery = db.prepare(insertNewLicenseQuery);

    try {
        prepareQuery.run(requestId, licenseType, isOffice, officeName, officeServiceNumber, requestDate, activities)
    } catch (error) {
        console.log(error)
        // console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}