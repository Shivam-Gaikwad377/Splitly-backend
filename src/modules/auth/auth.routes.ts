import { Router } from "express";
import { loginController, refreshTokenController } from "./auth.controller";
import { validateLogin,validateRefreshTokenCookie  } from "../../middleware/validation.middleware";
const router = Router();

router.post("/login", validateLogin, loginController);
router.post("/refresh", validateRefreshTokenCookie, refreshTokenController);

export default router;