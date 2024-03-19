import { insertAccountRequest } from '../models/AccountRequest.ts';
import { insertInspectionRequest } from '../models/InspectionRequest.ts';
import { insertNewLicenseRequest } from '../models/NewLicenseRequest.ts';
import {insertRequest} from '../models/Request.ts'
import {parseCSV} from '../utils/csv-parser.ts'
import { parseJSON } from '../utils/json-parser.ts';

/**
 * Handles the CSV file upload and processing.
 * @param {Request} request - The incoming request object.
 * @return {Response} - The response to be sent back to the client.
 */


// Define an interface for the row itself
interface RequestRow {
    RequestID: string;
    RequestType: string;
    RequestStatus: string;
    RequestData: string; // This is a JSON string that can be parsed into RequestDataDetails
}

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
        const startTime = performance.now(); 

        await addRowsInDatabase(rows);

        const endTime = performance.now();
        const totalDuration = (endTime - startTime) / 1000; 
        
        console.log(totalDuration)
        
        return new Response("File processed successfully", { 
            status: 201,
            headers: { "Content-Type": "application/json" }
        });


    } catch (error) {
        console.error("Error during file upload and processing:", error );
        return new Response("Internal server error", { status: 500 });
    }
}

async function addRowsInDatabase(rows: RequestRow[]){
    for (const row of rows) {
        try {
            await processRow(row);
        } catch (error) {
            console.error("Error processing row:", error);
        }
    }
}


async function processRow(row: RequestRow){
    let requestData = row["RequestData"]

    const obj = await parseJSON(requestData)

    let requestId = Number(row["RequestID"])
    let requestType = Number(row["RequestType"])
    let requestStatus = Number(row["RequestStatus"])
    let companyName = obj["CompanyName"]

    
    await insertRequest({requestId, requestType, requestStatus, companyName})
   
    if (requestType == 1){
        let licenseType = obj["LicenseType"]
        let isOffice = obj["IsOffice"]
        let officeName = obj["OfficeName"]
        let officeServiceNumber = obj["OfficeServiceNumber"]
        let requestDate = obj["RequestDate"]
        let activities = obj["Activities"]
        await insertNewLicenseRequest({requestId, licenseType, isOffice, officeName, officeServiceNumber, requestDate, activities})
    }

    if (requestType == 2){
        console.log(obj)
        let requesterName = obj["RequesterName"]
        let applicantName = obj["ApplicantName"]
        let userName = obj["UserName"]
        let contactEmail = obj["ContactEmail"]
        let permissions = obj["Permissions"]
        await insertAccountRequest({requestId, requesterName, applicantName, userName, contactEmail, permissions})
    }

    if (requestType == 3){
        let inspectionDate = obj["InspectionDate"]
        let inspectionTime = obj["InspectionTime"]
        let inspectionType = obj["inspectionType"]
        await insertInspectionRequest({requestId, inspectionDate, inspectionTime, inspectionType})
    }

};
