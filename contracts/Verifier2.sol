// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
contract Verifier2 {
    function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(msgHash, v, r, s);
    }
    
}