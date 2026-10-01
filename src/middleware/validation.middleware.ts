import type { NextFunction, RequestHandler } from "express";
import { AppError } from "../utils/app-error";

export const validateLogin: RequestHandler = (req, _res, next) => {
    const { identifier, password } = req.body ?? {};

    if (
        typeof identifier !== "string" ||
        identifier.trim() === "" ||
        typeof password !== "string" ||
        password.length === 0
    ) {
        throw new AppError(
            "Identifier and password are required",
            400,
            "VALIDATION_ERROR"
        );
    }

    next();
};

export const validateRefreshTokenCookie : RequestHandler = (
    req ,
    _res ,
    next : NextFunction
) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new AppError(
            "Refresh token not provided",
            401,
            "INVALID_REFRESH_TOKEN"
        );
    }

    next();
}