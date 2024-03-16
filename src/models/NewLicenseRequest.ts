import { db } from "../database/db.js";

interface NewLicenseRequestParams {
    RequestID: number;
    LicenseType: string;
    IsOffice: boolean;
    OfficeName: string;
    OfficeServiceNumber: string; 
    RequestDate: string;
}

export async function insertNewLicenseRequest(params: NewLicenseRequestParams) {
    const {RequestID, LicenseType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate} = params

    const insertNewLicenseQuery = `INSERT INTO NewLicense 
                (RequestID, LicenseType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    const prepareQuery = db.prepare(insertNewLicenseQuery);

    try {
        prepareQuery.run(RequestID, LicenseType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate)
    } catch (error) {
        console.log(`[CONSTRAIN ERROR] ${RequestID} already exists in the database`)
    }
    
}