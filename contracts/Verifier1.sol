// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;

contract Verifier1 {

	/*
	This function concatenates the given (hashed) message with the given prefix,
	then hashes the result.
	@param hashedMessage - the message signed by the web3 user (hashed) via eth_sign
	*/
	function prefixed(bytes32 hashedMessage) internal pure returns (bytes32) {
	return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMessage));
	}

	/*
	This function is used to recover the address that signed a message.
	@param hash - the hash of message that was signed
	@param v - the v value of the signature
	@param r - the r value of the signature
	@param s - the s value of the signature
	*/
	function testRecovery(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s) pure public returns (address) {

		bytes32 prefixedHashedMessage = prefixed(hashedMessage);
		address addr = ecrecover(prefixedHashedMessage, v, r, s);

		return addr;
	}

}
