import { Router } from "express";
import {
    getAllProducts,
    getFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, getAllProducts);
router.route("/featured").get(getFeaturedProduct);

export default router;
