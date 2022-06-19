
var Verifier = artifacts.require('./Verifier1.sol')


contract('Verifier1', (accounts) => {
  var address = accounts[0]

  it("ecrecover result matches signer's address", async function() {
	var instance = await Verifier.new({from: address});
	
	// Message to sign
	var msg = "Hello there"

	// create a hash of the message `msg` with `web3.utils.sha3` to obtain a 
	// fixed length hex string of 32 bytes
	var hashedMessage = web3.utils.sha3(msg)

	// Sign message with `web3.eth.sign` using private key from unlocked account 
	// (i.e. address from `account[0]` in ganache)
	var signature = await web3.eth.sign(hashedMessage, address)

	// trim 0x from signature and split into r and s and v
	signature = signature.slice(2)
	var r = `0x${signature.slice(0, 64)}`
	var s = `0x${signature.slice(64, 128)}`
	var v = (signature.slice(128, 130)) + 27

	// recover address from signature by passing in hashed message and signature (r, s, v)
	var result = await instance.testRecovery.call(hashedMessage, v, r, s)

	assert.equal(result, address)
  })
})