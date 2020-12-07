import Express from 'express';
import BodyParser from 'body-parser';
import { config } from 'dotenv';
// Custom
import Order  from "./Order.js";

config();

const app = Express();
const PORT = parseInt(process.env.PORT);

// Middleware
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// CONSTANTS
const ASK = "ASK";
const BID = "BID";
const BTC = "BTC";
const EUR = "EUR";
const GOLD = "gold";
const GRAM = "g";

const asksQueue = [
    new Order("000100", ASK, 57, EUR, 100, GRAM, GOLD),
    new Order("000101", ASK, 50, EUR, 100, GRAM, GOLD),
    new Order("000102", ASK, 52, BTC, 100, GRAM, GOLD),
    new Order("000103", ASK, 48, BID, 50, GRAM, GOLD)
];

app.post('/trade', (req, res) => {
    const bids = req.body.orders;
    if (bids.length === 0){
        res.send(`There are no orders to match in the request.`);
        return;
    }
    let message = '';
    for(const bid of bids){
        const currentBid = new Order(
            bid.id, bid.type,
            bid.price, bid.currency,
            bid.quantity, bid.unitOfMeasurement,
            bid.subject
        );
        const match = currentBid.matchBid(asksQueue);
        if (!!match){
            message += `Your order nº${currentBid.id} has been matched with order nº${match.id} for ${currentBid.quantity}${match.unitOfMeasurement}.\n`;
        }
    }
    if(message.length === 0){
        message = `No order could be matched.`;
    }
    res.send(message);
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});