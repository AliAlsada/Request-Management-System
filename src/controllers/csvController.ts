// import {parse} from 'csv-parse';
import { parse, parseString } from 'fast-csv';

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

    parseString(content, { headers: true })
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

   
    // return new Response(JSON.stringify(records), {
    //     status: 200, // HTTP 200 OK
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // });
    return new Response("Endpoint Not Found", { status: 404 })
}
