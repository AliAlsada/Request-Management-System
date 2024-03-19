import { db } from "../database/db.js";

interface NewLicenseRequestParams {
    requestId: number;
    requesterName: string;
    applicantName: string;
    userName: string;
    contactEmail: string; 
    permissions: string[]
}

export async function insertAccountRequest(params: NewLicenseRequestParams) {
    const {requestId, requesterName, applicantName, userName, contactEmail, permissions} = params

    const insertAccountQuery = `INSERT INTO AccountRequest 
                (RequestID, RequesterName, ApplicantName, UserName, ContactEmail) 
                VALUES (?, ?, ?, ?, ?)`;


    try {
        const prepareQuery = db.query(insertAccountQuery);
        db.query("BEGIN").run();

        prepareQuery.run(requestId, requesterName, applicantName, userName, contactEmail)
        const lastIdResult:any = db.query("SELECT last_insert_rowid() as id").get();
        const AccountID = lastIdResult['id'] 


        // Example of further operations, like inserting related permissions
        permissions.forEach(async (permission) => {
            const insertPermissionQuery = `INSERT INTO Permission (AccountID, PermissionType) VALUES (?, ?)`;
            const prepareQuery = db.query(insertPermissionQuery);
            prepareQuery.run(AccountID, permission)
        });

        db.query("COMMIT").run();
    } catch (error) {

        //in case the insertion of the account request was done successfully, 
        //but one the permission insertion failed, we need to rollback to avoid any inconsistency in the data
        db.query("ROLLBACK").run();
        // console.log(`[CONSTRAIN ERROR] ${requestId} already exists in the database`)
    }
    
}