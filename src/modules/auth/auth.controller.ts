import type { Request, Response } from "express";
import { login } from "./auth.services";

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

    res.status(200).json({
        accessToken: result.accessToken,
        user: result.user,
    });
}