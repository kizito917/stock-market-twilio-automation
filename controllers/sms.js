const twilio = require('twilio');
const { getMarketPrices } = require('../handlers/stock.handler');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const authorizedNumber1 = process.env.PERSONAL_NUMBER_1;
const authorizedNumber2 = process.env.PERSONAL_NUMBER_2;

const client = new twilio(accountSid, authToken);

const commandHandlers = {
    'get spy': async () => {
        const { marketPrice, volatilityResult } = await getMarketPrices('SPY');
        return `Market Price: ${marketPrice}\nVolatility Result: ${volatilityResult}`;
    },
    'get usar': async () => {
        const { marketPrice, volatilityResult } = await getMarketPrices('USAR');
        return `Market Price: ${marketPrice}`;
    }
};

const smsWebhook = async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const incomingMessage = req.body.Body.trim().toLowerCase();
    const fromNumber = req.body.From;
    
    console.log(`Received message: "${incomingMessage}" from ${fromNumber}`);
    
    // // Only process commands from authorized number
    // if (fromNumber !== authorizedNumber1 || fromNumber !== authorizedNumber2) {
    //     console.log(`Unauthorized access attempt from ${fromNumber}`);
    //     twiml.message('Unauthorized number');
    //     return res.type('text/xml').send(twiml.toString());
    // }
    
    // Check if the incoming message is a recognized command
    const command = Object.keys(commandHandlers).find(cmd => 
        incomingMessage === cmd || incomingMessage.startsWith(cmd + ' ')
    );
    
    if (command) {
        try {
            // Execute the command handler
            const responseData = await commandHandlers[command]();
            twiml.message(responseData);
        } catch (error) {
            console.error('Error executing command:', error);
            twiml.message('Error processing your command. Please try again.');
        }
    } else {
        twiml.message(`Unrecognized command. Send "help" for available commands.`);
    }
    
    res.type('text/xml').send(twiml.toString());
}

const sendSms = async (to, body) => {
    try {
        console.log("test");
        const { marketPrice, volatilityResult } = await getMarketPrices('USAR');
        const message = await client.messages.create({
            body: marketPrice,
            from: twilioNumber,
            to: process.env.YOUR_PERSONAL_NUMBER
        });
        
        console.log(`Message sent with SID: ${message.sid}`);

        const message2 = await client.messages.create({
            body: volatilityResult,
            from: twilioNumber,
            to: process.env.YOUR_PERSONAL_NUMBER
        });
        
        console.log(`Message sent with SID: ${message2.sid}`);
        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

module.exports = {
    smsWebhook,
    sendSms
}