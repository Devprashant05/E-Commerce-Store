import { Router } from "express";
import {
    addToCart,
    getCartProducts,
    removeAllFromCart,
    updateQuantity,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(addToCart);
router.route("/").get(getCartProducts);
router.route("/").delete(removeAllFromCart);
router.route("/:id").put(updateQuantity);

export default router;
