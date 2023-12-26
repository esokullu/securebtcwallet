
//Import dependencies
//const bip32 = require('bip32')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc)
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const CoinKey = require('coinkey')
const network = bitcoin.networks.mainnet //use networks.testnet for testnet
const path = `m/49'/0'/0'/0`

const run = (mnemonic) => {
  mnemonic = mnemonic.trim()
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  var node = bitcoin.HDNode.fromSeedBuffer(seed)
  var ck = CoinKey.fromWif(node.keyPair.toWIF())


  return {
    "address": ck.publicAddress,
    "key": node.keyPair.toWIF()
  };
}

module.exports = run;
