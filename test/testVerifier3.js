var Verifier3 = artifacts.require('./Verifier3.sol')
var ethers = require('ethers');
require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;

contract('Verifier3', (accounts) => {
	var addr = accounts[0]
    it("ecrecover result matches signer's address", async function() {
        var verifier = await Verifier3.new({from: addr});
        // Create message to sign
        var message = "Looking for the face I had before the world was made";
        //Create a wallet with privake key of addr 0 (ganache)
        var wallet = new ethers.Wallet(privateKey);
        // Sign the message with the wallet
        var signature = await wallet.signMessage(message)
        // Split the signature into its r, s and v components
        var sig = ethers.utils.splitSignature(signature);
        // Call the contract with the message and signature
        var promise = verifier.verifyString(message, sig.v, sig.r, sig.s);
        promise.then(function(signer) {
            // Check the computed signer matches the actual signer
            console.log("result: signer equals wallet address? ", signer === wallet.address);
        });
    });
})