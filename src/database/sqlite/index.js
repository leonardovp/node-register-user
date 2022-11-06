import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import {fileURLToPath} from 'url';

async function sqliteConnection() {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const database = await open({
        filename: path.resolve(__dirname, '.', 'database.db'),
        driver: sqlite3.Database
    });

    return database;
}

export { sqliteConnection };
