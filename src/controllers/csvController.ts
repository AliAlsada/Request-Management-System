import { insertAccountRequest } from "../models/AccountRequest.ts";
import { insertNewActivityRequest } from "../models/AddActivity.ts";
import { insertInspectionRequest } from "../models/InspectionRequest.ts";
import { insertNewLicenseRequest } from "../models/NewLicenseRequest.ts";
import { insertStampLicenseRequest } from "../models/StampLicense.ts";
import { countRows } from "../models/statistics.ts";
import { insertRequest } from "../models/Request.ts";
import { parseCSV } from "../utils/csv-parser.ts";
import { parseJSON } from "../utils/json-parser.ts";


// Define an interface for the row itself
interface RequestRow {
    RequestID: string;
    RequestType: string;
    RequestStatus: string;
    RequestData: string;
}

export async function upload(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        //check if the request does not contain a file or the file is not accessible
        if (!(file instanceof File) || !file.size) {
            return new Response("No file uploaded", { status: 404 });
        }

        //check if file is not csv file
        else if (!file.name.endsWith(".csv")) {
            return new Response("The file format is not csv", { status: 400 });
        }

        const content = await file.text();
        const rows = await parseCSV(content); //parse the csv are return an array that contain the csv rows

        //add rows the database
        await addRowsInDatabase(rows);

        return new Response("File processed successfully", {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error during file upload and processing:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

async function addRowsInDatabase(rows: RequestRow[]) {
    //count the number of rows for each table before adding new rows
    const initialRowsCount = await countRows();

    //calculate the time of inserting rows
    const startTime = performance.now();

    //add rows
    for (const row of rows) {
        try {
            await processRow(row);
        } catch (error) {
            console.error("Error processing row:", error);
        }
    }

    //calculate the end time
    const endTime = performance.now();
    const totalDuration = (endTime - startTime) / 1000;

    console.log(`\ntotal Time ${totalDuration}`);

    //count the number of rows after adding new rows
    const afterRowsCount = await countRows();

    // Calculate the differences in row counts
    const rowsAdded = calculateRowsDifference(initialRowsCount, afterRowsCount);
    console.log("Number of Inserted New Rows for Each Table\n ", rowsAdded);
}

function calculateRowsDifference(initialRowsCount: any, afterRowsCount: any) {
    // Iterate through each property of the initialCounts object
    for (const key in initialRowsCount) {
        if (initialRowsCount.hasOwnProperty(key)) {
            // Calculate the difference for each count
            afterRowsCount[key] = afterRowsCount[key] - initialRowsCount[key];
        }
    }

    return afterRowsCount;
}

async function processRow(row: RequestRow) {
    let requestData = row["RequestData"];

    const obj = await parseJSON(requestData);

    let requestId = Number(row["RequestID"]);
    let requestType = Number(row["RequestType"]);
    let requestStatus = Number(row["RequestStatus"]);
    let companyName = obj["CompanyName"];

    //insert common data in the Request table
    const inserted = await insertRequest({
        requestId,
        requestType,
        requestStatus,
        companyName,
    });

    //if the insertion of the request failed, no need to check for its type
    if (!inserted) return;

    await processRequestType(requestType, requestId, obj);
}

async function processRequestType( requestType: number, requestId: number, obj: any) {
    switch (requestType) {
        case 1:
            await handleNewLicense(requestId, obj);
            break;

        case 2:
            await handleAccountRequest(requestId, obj);
            break;

        case 3:
            await handleInspectionRequest(requestId, obj);
            break;

        case 4:
            await handleNewActivity(requestId, obj);
            break;

        case 5:
            await handleStampLicense(requestId, obj);
            break;

        default:
            console.log("Unknown request type:", requestType);
            break;
    }
}

async function handleNewLicense(requestId: number, obj: any) {
    let licenseType = obj["LicenceType"];
    let isOffice = obj["IsOffice"];
    let officeName = obj["OfficeName"];
    let officeServiceNumber = obj["OfficeServiceNumber"];
    let requestDate = obj["RequestDate"];
    let activities = obj["Activities"];
    
    await insertNewLicenseRequest({
        requestId,
        licenseType,
        isOffice,
        officeName,
        officeServiceNumber,
        requestDate,
        activities,
    });
}

async function handleAccountRequest(requestId: number, obj: any) {
    let requesterName = obj["RequesterName"];
    let applicantName = obj["ApplicantName"];
    let userName = obj["UserName"];
    let contactEmail = obj["ContactEmail"];
    let permissions = obj["Permissions"];
    await insertAccountRequest({
        requestId,
        requesterName,
        applicantName,
        userName,
        contactEmail,
        permissions,
    });
}

async function handleInspectionRequest(requestId: number, obj: any) {
    let inspectionDate = obj["InspectionDate"];
    let inspectionTime = obj["InspectionTime"];
    let inspectionType = obj["inspectionType"];
    await insertInspectionRequest({
        requestId,
        inspectionDate,
        inspectionTime,
        inspectionType,
    });
}

async function handleNewActivity(requestId: number, obj: any) {
    let licenseId = obj["LicenceID"];
    let activities = obj["Activities"];
    await insertNewActivityRequest({ requestId, licenseId, activities });
}

async function handleStampLicense(requestId: number, obj: any) {
    let licenseId = obj["LicenceID"];
    let requestDate = obj["RequestDate"];
    await insertStampLicenseRequest({ requestId, licenseId, requestDate });
}
