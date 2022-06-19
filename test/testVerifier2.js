
var Verifier2 = artifacts.require('./Verifier2.sol')

function toHex(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
}

contract('Verifier2', (accounts) => {
	var addr = accounts[0]

	it("ecrecover result matches signer's address", async function() {
		var instance = await Verifier2.new({from: addr});

		// Create message `msg` to sign
		const msg = 'Rick Sanchez'

		// Convert `msg` to hex string
		const hex_msg = '0x' + toHex(msg)

		// Sign message with `web3.eth.sign` using private key from 
		// unlocked account (address from `account[0]` in ganache) 
		let signature = await web3.eth.sign(hex_msg, addr)

		// Retrieve signature components `r`, `s` and `v`
		signature = signature.substr(2);
		const r = '0x' + signature.slice(0, 64)
		const s = '0x' + signature.slice(64, 128)
		const v = '0x' + signature.slice(128, 130)
		var v_decimal = web3.utils.toDecimal(v)
		if(v_decimal != 27 || v_decimal != 28) {
			v_decimal += 27
		}
		
		try {
			// Concatenate off line *ethereum specific signature prefix* string 
			// (`\x19Ethereum Signed Message:\n" + len(hashedMessage)`) with 
			// original `msg` and hash the new string
			const fixed_msg = `\x19Ethereum Signed Message:\n${msg.length}${msg}`
			const fixed_msg_sha = web3.utils.sha3(fixed_msg)

			// Call solidity `recoverAddress` validator, with 
			// signature `r`, `s`, `v` and `fixed_msg_sha` as arguments
			const result = await instance.recoverAddr.call(
				fixed_msg_sha,
				v_decimal,
				r,
				s
			)
			assert.equal(result, addr)
		} catch(e) {
			console.log(e)
			assert.equal(e, null)
		}
	});
});
