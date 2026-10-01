import bcrypt from 'bcryptjs';
import { findUserByIdentifier, createAuthSession, findAuthSessionByTokenHash, rotateRefreshToken, revokeAuthSession } from './auth.repository';
import { generateRefreshToken, hashRefreshToken } from '../../utils/auth/refreshToken';
import { signAccessToken } from '../../utils/auth/jwt';
import { AppError } from '../../utils/app-error';


export async function login(identifier: string, password: string) {
    const user = await findUserByIdentifier(identifier);

    if (!user) {
        throw new AppError(
            "Invalid credentials",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new AppError(
            "Invalid credentials",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    if (!user.email_isverified) {
        throw new AppError(
            "Email not verified",
            403,
            "EMAIL_NOT_VERIFIED"
        );
    }


    // Generate a new refresh token
    const refreshToken = generateRefreshToken();

    // Hash the refresh token before storing it in the database
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Create a new auth session in the database
    const authSession = await createAuthSession(BigInt(user.id), hashedRefreshToken);

    // Generate an access token
    const accessToken = signAccessToken(user.id, authSession.id);
    const loggedInUser = {
        userId: user.id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        
    }
    // return the access token and refresh token
    return {
        accessToken,
        refreshToken,
        user: loggedInUser

    }
}

export async function refreshTokenService(oldRefreshToken: string) {
    const hashedOldRefreshToken = hashRefreshToken(oldRefreshToken);

    const authSession = await findAuthSessionByTokenHash(
        hashedOldRefreshToken
    );

    if (!authSession) {
        throw new AppError(
            "Invalid refresh token",
            401,
            "INVALID_REFRESH_TOKEN"
        );
    }

  

    if (new Date(authSession.expires_at).getTime() <= Date.now() || authSession.revoked_at !== null) {
        throw new AppError(
            "Invalid refresh token",
            401,
            "INVALID_REFRESH_TOKEN"
        );
    }

    const newRefreshToken = generateRefreshToken();
    const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);

    const updateSuccess = await rotateRefreshToken(
        BigInt(authSession.id),
        hashedNewRefreshToken,
        hashedOldRefreshToken
    );

    if (!updateSuccess) {
        throw new AppError(
            "Invalid refresh token",
            401,
            "INVALID_REFRESH_TOKEN"
        );
    }

    const accessToken = signAccessToken(
        authSession.user_id,
        authSession.id
    );

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
}

export async function logoutService(sessionId: bigint, userId: bigint): Promise<boolean> {
    const revokeSuccess = await revokeAuthSession(sessionId, userId);
    if(!revokeSuccess) {
        throw new AppError(
            "Unauthorized request",
            401,
            "UNAUTHORIZED_REQUEST"
        );
    }
    return revokeSuccess;
}



