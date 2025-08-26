import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
    res.send("Route working");
});

export default router;
