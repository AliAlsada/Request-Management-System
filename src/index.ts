import { setupDatabase } from "./database/db.js";
import { upload } from './controllers/csvController.ts';


const HOSTNAME = "localhost"
const PORT = 8080

Bun.serve({
    port: PORT,
    hostname: HOSTNAME,
    fetch: fetchHandler,
});

async function fetchHandler(request: Request): Promise<Response>{
    const { url, method } = request;
    
    if (method == "POST" && url == "/csv"){
        // Process the CSV file upload
        return await upload();
    }

    return new Response("Endpoint Not Found", { status: 404 })
}