import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createCheckoutSession,
    checkoutSucess,
} from "../controllers/payment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-checkout-session").post(createCheckoutSession);
router.route("/checkout-success").post(checkoutSucess);

export default router;
