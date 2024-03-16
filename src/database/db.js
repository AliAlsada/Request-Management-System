import { Database } from "bun:sqlite";

const DATABASE_PATH = "../db.sqlite";


//database connection
export const db = new Database(DATABASE_PATH);
