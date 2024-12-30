const express = require("express")
const connectDB = require("./config/db.js")
const app = express();

connectDB();

const port = 3000;
app.listen(port,() => {
    console.log(`Server is running at http://localhost:${port}`);
})