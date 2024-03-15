import { setupDatabase } from "./database/setupDatabase.js";
import { upload } from './controllers/csvController.ts';


const HOSTNAME = "localhost"
const PORT = 8080

// Initialize the server after setting up the database
await setupDatabase();

Bun.serve({
    port: PORT,
    hostname: HOSTNAME,
    fetch: fetchHandler,
});

async function fetchHandler(request: Request): Promise<Response>{
    const { url, method } = request;

    if (method == "POST" && url.endsWith("/csv")){
        // Process the CSV file upload
        return await upload(request);
    }

    //unspecified routes
    return new Response("Endpoint Not Found", { status: 404 })
}