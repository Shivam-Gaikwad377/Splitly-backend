import { beforeAll, afterAll } from "vitest";
import { pool } from "../../src/config/database";

beforeAll(async () => {
    await pool.query("SELECT 1");
});

afterAll(async () => {
    await pool.end();
});