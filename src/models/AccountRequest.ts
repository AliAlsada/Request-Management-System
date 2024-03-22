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
                
    const insertPermissionQuery = `INSERT INTO Permission (AccountID, PermissionType) VALUES (?, ?)`;

    //prepare both queries
    const prepareinsertAccount = db.prepare(insertAccountQuery);
    const prepareinsertPermission = db.prepare(insertPermissionQuery);


    //Incase the insertion of Account request succeed, 
    //while the insertion of the permissions failed, 
    //rollback to avoid any inconsistency in the data
    const insertTransaction = db.transaction(() => {
        prepareinsertAccount.run(requestId, requesterName, applicantName, userName, contactEmail);
        
        //get the primary key of the inserted account request
        const lastIdResult:any = db.query("SELECT last_insert_rowid() as id").get();
        const AccountID = lastIdResult['id']
        
        //run the query for each permission
        permissions.forEach(async (permission) => {
            prepareinsertPermission.run(AccountID, permission)
        });
    });

    //start transaction
    //If an exception is thrown, the transaction will be rolled back.
    insertTransaction() 
}
