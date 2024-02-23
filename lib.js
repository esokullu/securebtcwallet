
// sign https://aniketdivekar.medium.com/bitcoin-create-sign-and-push-transaction-2ea877c08ab4
// also https://snyk.io/advisor/npm-package/bitcoinjs-lib/functions/bitcoinjs-lib.TransactionBuilder


var BITCOIN_DIGITS = 8;
var BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);

function _httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
}


// https://blockchain.info/rawaddr/1MVPYNnVngGZUtXXK9r27HrJnXsHnEymhc
function getBalance(addr) {
    let output = _httpGet("https://blockchain.info/q/addressbalance/"+addr);
    let res = JSON.parse(output);
    return res;
}


// https://bitcoinfees.earn.com/api/v1/fees/recommended
function getFees() {
    let output = _httpGet("https://mempool.space/api/v1/fees/recommended");
    let res = JSON.parse(output);
    return {
        hourFee: res.hourFee,
        fastestFee: res.fastestFee
    };
}

// https://blockchain.info/unspent?active=17o3e81yPBrN12v84jg1S3A58VUcNUxsG8
function getUtxo(addr)
{
    let output = _httpGet("https://blockchain.info/unspent?active="+addr);
    let res = JSON.parse(output);
    let unspent = res.unspent_outputs; 
    return unspent.map(function (e) {
        return {
            txid: e.tx_hash_big_endian,
            vout: e.tx_output_n,
            satoshis: e.value,
            confirmations: e.confirmations
        };
    });
}

function satToBtc(amount) {
    // Calculate the amount in BTC
    let btcAmount = amount / BITCOIN_SAT_MULT;
    
    // Convert to string with a dynamic number of decimal places based on BITCOIN_DIGITS
    // This ensures it won't shorten the number using scientific notation
    return btcAmount.toFixed(BITCOIN_DIGITS);
}

function new_broadcastTransaction(transaction) {
    console.log(transaction);
    transaction = transaction.trim();
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://insight.bitpay.com/api/tx/send", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    
    // Prepare the JSON payload with the signed transaction hex
    var payload = JSON.stringify({
        rawtx: transaction
    });
    
    xhttp.send(payload);
    
    return xhttp.responseText;
}


function broadcastTransaction(transaction) {
    console.log(transaction);
    transaction = transaction.trim();
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://blockchain.info/pushtx", false);
    //xhttp.open("POST", "https://www.f2pool.com/pushtx", false);
    //xhttp.open("POST", "https://api.blockcypher.com/v1/btc/main/txs/push", false)
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('tx='+transaction);
    //xhttp.send('hex='+transaction);
    /*xhttp.send(JSON.stringify({
        "tx": transaction
    }));*/
    return xhttp.responseText;
    /*var res = JSON.parse(xhttp.responseText);
    return res.hash;*/
}

// https://blockchain.info/unspent?active=17o3e81yPBrN12v84jg1S3A58VUcNUxsG8
function getUtxo(addr)
{
    let output = _httpGet("https://blockchain.info/unspent?active="+addr);
    let res = JSON.parse(output);
    let unspent = res.unspent_outputs; 
    return unspent.map(function (e) {
        return {
            txid: e.tx_hash_big_endian,
            vout: e.tx_output_n,
            satoshis: e.value,
            confirmations: e.confirmations
        };
    });
}