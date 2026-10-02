import type { Request, Response } from "express";
import { login, logoutService, refreshTokenService } from "./auth.services";
import { AppError } from "../../utils/app-error";
import { ApiResponse } from "../../types/apiResponse";
import { env } from "../../config/env";
import { AuthenticatedUser } from "../../types/auth";
export async function loginController(
    req: Request,
    res: Response
) {
    const { identifier, password } = req.body;

    const result = await login(identifier, password);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    const response: ApiResponse<{ accessToken: string; user: any }> = {
        success: true,
        message: "Login successful",
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    };
    res.status(200).json(response);
}

export async function refreshTokenController(
    req: Request,
    res: Response
) {
    const refreshToken = req.cookies?.refreshToken;
    const newTokens = await refreshTokenService(refreshToken);

    res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const response: ApiResponse<{ accessToken: string }> = {
        success: true,
        message: "Tokens refreshed successfully",
        data: {
            accessToken: newTokens.accessToken,
        },
    };

    res.status(200).json(response);
};

export async function logoutController(req: Request, res: Response) {
    const sessionId = BigInt(req.user.sessionId);
    const userId = BigInt(req.user.userId);
    const refreshToken = req.cookies?.refreshToken;
    await logoutService(sessionId, userId);



    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "strict",
    });
    res.status(204).send();
}