# Signing a message and veryfying signer's address in ethereum

## About
This repo contains 3 different ways of signing a message *off-chain* and verifying signer's address *on-chain* using solidity `ecrecover`
## Requirements

- Truffle installed (you can install it as `npm -i -g truffle`)
- Ganache running on port 7545
- install dependencies (`npm install`)
- `.env` file containing private key for account[0] from Ganache 

## Usage

```
truffle test
```

## Examples

---
--- 

### Use case 1

- Use `web3.js` for off-line signing
- Hash the message before signing
- Use *unlocked* account from ether client (i.e. ganache) for signing

#### Process flow chart

- Off line signature (`test/testVerifier1.js`) 
```mermaid
flowchart LR;
    A(msg to sign)-->|web3.utils.sha3|B(hashed msg\n32 bytes)-->X-->C(signature)-->|slice signature|D(r,s,v);
    F(address) <--> G[(private key)]-->X((web3.eth.sign))
    style D fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style B fill:#fd5,stroke:#333,stroke-width:4px,color:#000
    style F fill:#0F0,stroke:#333,stroke-width:4px,color:#000
```

***

- On chain verification (`contracts/Verifier1.sol`)

```mermaid
flowchart LR;
    A(hashed msg\n32 bytes)-->X((abi.encodePacked))-->B(concatenated\nstring)-->|keccak256|D(hashed string)-->C(ecrecover)-->G(address);
    E(eth \nspecific \nsignature prefix *)-->X;
    F(r,s,v)-->C;
    style F fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style A fill:#fd5,stroke:#333,stroke-width:4px,color:#000
    style C fill:#fff,stroke:#333,stroke-width:4px,color:#F00
    style G fill:#0F0,stroke:#333,stroke-width:4px,color:#000
```

---
--- 

### Use case 2
- Use `web3.js` for off-line signing
- Use *unlocked* account from ether client (i.e. ganache) for signing
- Append `eth specific prefix` *off-line* before passing data *on-chain*

#### Process flow chart

- Off line signature (`test/testVerifier2.js`) 

```mermaid
flowchart LR;
    A(msg to sign)-->|to hex|B(hex\nencoded\nmsg)-->X-->C(signature)-->|slice signature|D(r,s,v);
    F(address) <--> G[(private key)]-->X((web3.eth.sign))
    E(eth \nspecific \nsignature prefix *)-->Y;
    A-->Y((concatenate))-->|web3.utils.sha3|Z(concatenated\nmsg\nhashed\n32bytes)
    style D fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style Z fill:#fd5,stroke:#333,stroke-width:4px,color:#000
    style F fill:#0F0,stroke:#333,stroke-width:4px,color:#000
```

***

- On chain verification (`contracts/Verifier2.sol`)

```mermaid
flowchart LR;
   D(concatenated\nmsg\nhashed\n32bytes)-->C(ecrecover)-->G(address);
   
    F(r,s,v)-->C;
    style F fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style D fill:#fd5,stroke:#333,stroke-width:4px,color:#000
    style C fill:#fff,stroke:#333,stroke-width:4px,color:#F00
    style G fill:#0F0,stroke:#333,stroke-width:4px,color:#000
```

--- 
--- 

### Use case 3
- Use `ethers.js`
- Does not require unlocked account
- Sign message off line via `wallet.signMessage`
- Get signature components with `ethers.utils.splitSignature`
- Pass arbitrary length message to verifier contract (i.e. not fixed to 32 bytes)
- Use in-line assembly to deconstruct and reconstruct message to verify

#### Process flow chart:

- Off line signature (`test/testVerifier3.js`)

```mermaid
flowchart LR;
    A(msg)-->X;
    F(address) <--> G(key)-->|new ethers.Wallet|X[(wallet)]-->|wallet.signMessage|Y(signature)-->|ethers.utils.splitSignature|D(r,s,v)
    style D fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style F fill:#0F0,stroke:#333,stroke-width:4px,color:#000
    style A fill:#fd5,stroke:#333,stroke-width:4px,color:#000
```

***

- On chain verification (`contracts/Verifier3.sol`)

```mermaid
flowchart LR;
    A(msg)-->X((abi.encodePacked))-->B(concatenated\nstring)-->|keccak256|D(hashed string)-->C(ecrecover)-->G(address);
    E(eth \nspecific \nsignature prefix *)-->Y[(construct\neth prefix\nvar length)]-->X;
    A-->Y
    F(r,s,v)-->C;
    style F fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style A fill:#fd5,stroke:#333,stroke-width:4px,color:#000
    style C fill:#fff,stroke:#333,stroke-width:4px,color:#F00
    style G fill:#0F0,stroke:#333,stroke-width:4px,color:#000
```
\* `\x19Ethereum Signed Message:\n" + len(hashedMessage)`
