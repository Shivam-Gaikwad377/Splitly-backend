import { pool } from "../../config/database";

export async function findUserByIdentifier(identifier: string) {

    const result = await pool.query(
        "SELECT email, phone, id, password_hash, name, email_isverified FROM users WHERE email = $1 OR phone = $1 LIMIT 1",
        [identifier]
    );

    return result.rows[0] ?? null;

    
}

export async function createAuthSession(userId: bigint, refreshTokenHash: string) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set expiration to 30 days from now
    const result = await pool.query(
        "INSERT INTO auth_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id",
        [userId, refreshTokenHash, expiresAt]
    );
    return result.rows[0] ?? null;
}