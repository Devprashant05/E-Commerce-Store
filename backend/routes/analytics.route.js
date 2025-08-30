import { Router } from "express";
import { adminRoute, verifyJWT } from "../middleware/auth.middleware.js";
import {getAnalyticsStats} from '../controllers/analytics.controller.js'

const router = Router();

router.use(verifyJWT, adminRoute);

router.route("/").get(getAnalyticsStats)

export default router;
