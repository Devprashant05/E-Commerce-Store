import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCoupon);
router.route("/validate").post(validateCoupon);

export default router;
