const express = require("express");
const { userRoute } = require("./routes/userRoute");

const app = express();
const PORT = 8000;

app.use("/", userRoute);

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (err) {
        console.log(err.message);
    }
}

startServer();