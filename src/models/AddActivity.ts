import { db } from "../database/db.js";

interface AddActivityParams {
    requestId: number;
    licenseId: string;
    activities: string[]
}

export async function insertNewActivityRequest(params: AddActivityParams) {
    const {requestId, licenseId, activities} = params

    const insertAddActivityQuery = `INSERT INTO AddActivity 
                (RequestID, LicenseID) 
                VALUES (?, ?)`;
                
    const insertActivityquery = `INSERT INTO Activity (AddActivityID, ActivityType) VALUES (?, ?)`;

    //prepare both queries
    const prepareinsertAddActivity = db.prepare(insertAddActivityQuery);
    const prepareinsertActivity = db.prepare(insertActivityquery);


    //Incase the insertion of add new activity request succeed, 
    //while the insertion of its activites failed, 
    //rollback to avoid any inconsistency in the data
    const insertTransaction = db.transaction(() => {
        prepareinsertAddActivity.run(requestId, licenseId);
        
        //get the primary key of the inserted account request
        const lastIdResult:any = db.query("SELECT last_insert_rowid() as id").get();
        const addActivityID = lastIdResult['id'];
        
        //run the query for each activity
        activities.forEach(async (activity) => {
            prepareinsertActivity.run(addActivityID, activity);
        });
    });

    //start transaction
    //If an exception is thrown, the transaction will be rolled back.
    insertTransaction() 
}
