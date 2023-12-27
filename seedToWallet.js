const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib')
const CoinKey = require('coinkey')

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

window.seedToWallet = run;
