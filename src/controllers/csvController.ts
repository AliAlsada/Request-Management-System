// import {parse} from 'csv-parse';

import {insertRequest} from '../models/Request.ts'
import {parseCSV} from '../utils/csv-parser.ts'
import { csv_verifier } from '../utils/csv-verifier.ts';

// /**
//  * Handles the CSV file upload and processing.
//  * @param {Request} request - The incoming request object.
//  * @return {Response} - The response to be sent back to the client.
//  */
export async function upload(request: Request) {
    try{
        const formData = await request.formData();
        const file = formData.get("file");

        //check if the request does not contain a file or the file is not accessible
        if (!(file instanceof File) || !file.size) {
            return new Response("No file uploaded", { status: 404 });
        }
        
        //check if file is not csv file
        else if (!file.name.endsWith('.csv')) {
            return new Response("The file format is not csv", { status: 400 });
        }

        const content = await file.text();
        const rows = await parseCSV(content); //parse the csv are return an array that contain the csv rows
    
        //add rows the database
        await addRowsInDatabase(rows);
        return new Response("File processed successfully", { 
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error during file upload and processing:", error );
        return new Response("Internal server error", { status: 500 });
    }
}

async function addRowsInDatabase(rows:any){
    rows.forEach(async (row: any) => {
        let RequestID = Number(row["RequestID"])
        let RequestType = Number(row["RequestType"])
        let RequestStatus = Number(row["RequestStatus"])

        let RequestData = row["RequestData"]
        const obj = JSON.parse(RequestData);

        let CompanyName = obj["CompanyName"]

        
        await insertRequest({RequestID, RequestType, RequestStatus, CompanyName})
    });
}
