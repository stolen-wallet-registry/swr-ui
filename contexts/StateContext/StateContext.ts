import { RegistrationTypes, RegistrationValues } from '@utils/types';
import { createContext } from 'react';

export type StateConfig = {
	connectedAddress: string | null;
	registrationType: RegistrationTypes;
	step: RegistrationValues | null;
	address: string | undefined;
	network: number | undefined;
	trustedRelayer: string | null;
	trustedRelayerFor: string | null;
	peerId: string | null;
	peerAddrs: string | null;
	connectToPeer: string | null;
	connectToPeerAddrs: string | null;
	connectedToPeer: boolean;
	includeWalletNFT: boolean | null;
	includeSupportNFT: boolean | null;
	includeWalletNFTAgree: boolean | null;
	includeSupportNFTAgree: boolean | null;
	isRegistering: boolean | null;
	acknowledgementReceipt?: string | null;
	registrationReceipt?: string | null;
};

type StateContextType = {};

// {
//   "name": "Kwenta",
//   "symbol": "KWENTA",
//   "decimals": 18,
//   "description": "KWENTA token on Optimism",
//   "website": "https://kips.kwenta.io/kips/kip-4/",
//   "twitter": "@kwenta_io",
//   "tokens": {
//     "ethereum": {
//       "address": "0x6789D8a7a7871923Fc6430432A602879eCB6520a"
//     },
//     "optimism": {
//       "address": "0x920Cf626a271321C151D027030D5d08aF699456b"
//     },
//     "goerli": {
//       "address": "0xf36c9a9E8333663F8CA3608C5582916628E79e3f"
//     },
//     "optimism-goerli": {
//       "address": "0xDA0C33402Fc1e10d18c532F0Ed9c1A6c5C9e386C"
//     }
//   }
// }
