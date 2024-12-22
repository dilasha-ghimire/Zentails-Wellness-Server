const express = require("express")
const app = express();

app.use("/",() => {
    console.log("Hello, World!");
})

const port = 3000;
app.listen(port,() => {
    console.log(`Server is running at http://localhost:${port}`);
})