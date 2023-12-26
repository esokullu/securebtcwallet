const express = require('express');
const cors = require('cors');
const path = require('path')
const seedToWallet = require('./seedToWallet');
const signTransaction = require('./sendBitcoin');
const { validate } = require('bitcoin-address-validation');
const app = express();
const port = 3000;



app.use(express.json()); // for parsing application/json

app.use(express.static('./'));
app.use(cors({
    origin: '*', // Allow all origins
  methods: '*', // Allow all methods
  allowedHeaders: '*', // Allow all headers
  credentials: true, // Allow credentials
  preflightContinue: false,
  optionsSuccessStatus: 204
})); // This will enable CORS for all routes

app.post('/generate-wallet', (req, res) => {
  try {
    const mnemonic = req.body.mnemonic; // req.query.mnemonic;
    if (!mnemonic) {
      return res.status(400).send('Mnemonic is required');
    }
    const wallet = seedToWallet(mnemonic);
    res.json(wallet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/send-bitcoin', (req, res) => {
    console.log('Request received at /send-bitcoin:', req.body);

    const {sendFrom, privatekey, sendTo, sendAmount, sendFees, sendUtxo} = req.body;
    if(!validate(sendTo, 'mainnet')) {
        console.error('Error: Invalid Bitcoin address');
        res.status(400).send('Error: Invalid Bitcoin address');
        return;
      }
      try { 
        let res = signTransaction(sendFrom, privatekey, sendTo, sendAmount, sendFees, sendUtxo);
        console.log('Transaction signed successfully:', result);
        res.send(result);
      }
      catch(e) {
        console.error('Error in signTransaction:', e);
        res.status(500).send('Error: ' + e);
        return;
      }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
