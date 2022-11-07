import { Chain } from '@rainbow-me/rainbowkit';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { CONTRACT_ADDRESSES, DOMAIN_SALTS } from '../utils/constants';
import { StateConfig, ACCOUNTS_KEY } from './useLocalStorage';
interface Domain712 {
	name: string;
	version: string;
	chainId: number;
	verifyingContract: string;
	salt: string;
}
export interface signTypedDataProps {
	domain: Domain712;
	types: any;
	value: any;
	primaryType: string;
}

interface AcknowledgementValues {
	signer: any;
	chain:
		| (Chain & {
				unsupported?: boolean | undefined;
		  })
		| undefined;
	address: string;
}

export const buildAcknowledgementStruct = async ({
	signer,
	chain,
	address,
}: AcknowledgementValues): Promise<signTypedDataProps> => {
	const localState: StateConfig = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) as string);

	const stollenWalletRegistry = await StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry,
		signer
	);

	if (!chain?.id) {
		throw new Error('Chain ID not found');
	}

	if (!localState.address || !localState.trustedRelayer) {
		throw new Error('Missing required data');
	}

	// const { deadline } = await stollenWalletRegistry.generateHashStruct(localState.trustedRelayer);
	// const nonce = await stollenWalletRegistry.nonces(address!);

	// EIP712Domain: [
	//   { name: 'name', type: 'string' },
	//   { name: 'version', type: 'string' },
	//   { name: 'chainId', type: 'uint256' },
	//   { name: 'verifyingContract', type: 'address' },
	//   { name: 'salt', type: 'bytes32' },
	// ],
	// { name: 'nonce', type: 'uint256' },
	// { name: 'deadline', type: 'uint256' },
	// deadline,
	// nonce: nonce,

	return {
		types: {
			AcknowledgementOfRegistry: [
				{ name: 'owner', type: 'address' },
				{ name: 'forwarder', type: 'address' },
			],
		},
		primaryType: 'AcknowledgementOfRegistry',
		domain: {
			name: 'AcknowledgementOfRegistry',
			version: '4',
			chainId: chain?.id!,
			verifyingContract: CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry,
			salt: DOMAIN_SALTS.ACKNOWLEDGEMENT_OF_REGISTRY,
		},
		value: {
			owner: localState.address,
			forwarder: localState.trustedRelayer,
		},
	};
};
