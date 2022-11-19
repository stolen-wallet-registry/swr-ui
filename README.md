This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Tech Stack

- nextjs
- ChalkraUI
- lodash
- react-hook-form
- Jest

# CI

- github actions
- dependabot

##### EIP-2771: Secure Protocol for Native Meta Transactions

1) Check that the `Forwarder` is trusted, the signature to be extracted contains the original signer and their specified trusted forwarder.
2) extract the `owner` from the original transaction and compare the owner against the signature user.
3) once the signature is verified, the transacton can proceed.

##### EIP-712: Typed structured data hashing and signing

TLDR - EIP712 is all about user friendliness by injecting a clear message into the signing transactions.

1) string name -  the user readable name of signing domain, i.e. the name of the DApp or the protocol.
2) string version -  the current major version of the signing domain.
3) uint256 chainId -  the EIP-155 chain id.
4) address verifyingContract -  the address of the contract that will verify the signature.
5) bytes32 salt -  an disambiguating salt for the protocol.

Typed Data:

1) address owner - signer to confirm of transaction - user to apply contract logic to.
2) address trustedRelayer - msg.sender of contract transaction, check that signer included them as trusted relayer.
3) uint256 nonce - nonces[owner] - basic prevention replay attacks
4) uint256 deadline - invalidates the transaction if users took to long to accomplish the transaction flow

##### WebRTCStar

- libp2p WebRTC transport that includes a discovery mechanism provided by the signalling-star
