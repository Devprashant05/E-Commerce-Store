import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 5500;
connectDB()
    .then(
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        })
    )
    .catch((error) =>
        console.log(`Error while connecting DB: ${error.message}`)
    );
