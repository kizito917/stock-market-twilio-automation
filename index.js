// External imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT;

// Internal imports
const { getMarketPrices } = require('./handlers/stock.handler');
const smsRoute = require('./routes/sms');

const NODE_ENV = process.env.NODE_ENV || "dev";

if (NODE_ENV === "dev") {
    app.use(morgan("dev"));
}

const corsOptions = {
    origin: "*",
    optionSuccessStatus: 200,
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/api', smsRoute);

app.get("/", (req, res) => {
    res.send("Server is live");
});

try {
    app.listen(port, async () => {
        console.log(`⚡️Server is running at port ${port}`);

        await getMarketPrices('USAR');
    });
} catch (err) {
    process.exit(1);
}