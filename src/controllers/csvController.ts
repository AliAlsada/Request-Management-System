// import {parse} from 'csv-parse';
import { parse, parseString } from 'fast-csv';
import {insertRequest} from '../models/Request.ts'
import {db} from '../database/db.js'

// /**
//  * Handles the CSV file upload and processing.
//  * @param {Request} request - The incoming request object.
//  * @return {Response} - The response to be sent back to the client.
//  */
export async function upload(request: Request) {
    
    const formData = await request.formData();
    const file = formData.get("file");

    //check if the request does not contain a file or the file is not accessible
    if (!(file instanceof File) || !file.size) {
        return new Response("No file uploaded", { status: 400 });
    }

    const content = await file.text();

    let rows:any = []
    parseString(content, { headers: true })
        .on('Error parsing CSV:', error => console.error(error))
        .on('data', row => rows.push(row))
        .on('end', () => addRowsInDatabase(rows));

    // return new Response(JSON.stringify(records), {
    //     status: 200, // HTTP 200 OK
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // });
    return new Response("Endpoint Not Found", { status: 404 })
}

async function addRowsInDatabase(rows:any){
    rows.forEach(async (row: any) => {
        let RequestID = Number(row["RequestID"])
        let RequestType = Number(row["RequestType"])
        let RequestStatus = Number(row["RequestStatus"])

        let RequestData = row["RequestData"]
        const obj = JSON.parse(RequestData);

        let CompanyName = obj["CompanyName"]

    
        await insertRequest(RequestID, RequestType, RequestStatus, CompanyName)
    });
}
