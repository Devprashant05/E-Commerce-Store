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

router
    .route("/")
    .post(addToCart)
    .get(getCartProducts)
    .delete(removeAllFromCart);
router.route("/:id").put(updateQuantity);

export default router;
