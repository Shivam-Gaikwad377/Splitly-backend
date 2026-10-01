import { Router } from "express";
import { loginController, logoutController, refreshTokenController } from "./auth.controller";
import { validateLogin,validateRefreshTokenCookie,   } from "../../middleware/validation.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
const router = Router();

router.post("/login", validateLogin, loginController);
router.post("/refresh", validateRefreshTokenCookie, refreshTokenController);
router.post("/logout", authMiddleware , logoutController);
export default router;