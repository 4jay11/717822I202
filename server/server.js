const express = require("express");
const { userRoute } = require("./routes/userRoute");
const {postRoute} = require("./routes/postRoute");
const app = express();
const PORT = 8000;

app.use("/", userRoute);
app.use("/", postRoute);
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