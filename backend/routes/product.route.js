import { Router } from "express";
import {
    getAllProducts,
    getFeaturedProduct,
    createProduct,
    deleteProduct,
    getRecommendedProduct,
    getProductByCategory,
    toggleFeaturedProduct
} from "../controllers/product.controller.js";
import { adminRoute, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, getAllProducts);
router.route("/featured").get(getFeaturedProduct);
router.route("/recommendations").get(getRecommendedProduct);
router.route("/category/:category").get(getProductByCategory);
router
    .route("/")
    .post(verifyJWT, adminRoute, upload.single("productImage"), createProduct);

router.route("/:productId").delete(verifyJWT, adminRoute, deleteProduct);
router.route("/:productId").patch(verifyJWT, adminRoute, toggleFeaturedProduct);

export default router;
