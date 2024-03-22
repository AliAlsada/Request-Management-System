// Helper function to parse JSON safely
export function parseJSON(jsonString: string) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return new Response("Internal server error", { status: 500 });
    }
}