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
	chainId: number;
	address: string;
}

export const buildAcknowledgementStruct = async ({
	signer,
	chainId,
	address,
}: AcknowledgementValues): Promise<signTypedDataProps> => {
	const localState: StateConfig = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) as string);

	const stollenWalletRegistry = await StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES.local.StolenWalletRegistry,
		signer
	);

	if (!chainId) {
		throw new Error('Chain ID not found');
	}

	if (!localState.address || !localState.trustedRelayer) {
		throw new Error('Missing required data');
	}

	const { deadline } = await stollenWalletRegistry.generateHashStruct(localState.trustedRelayer);
	const nonce = await stollenWalletRegistry.nonces(address!);

	// EIP712Domain: [
	//   { name: 'name', type: 'string' },
	//   { name: 'version', type: 'string' },
	//   { name: 'chainId', type: 'uint256' },
	//   { name: 'verifyingContract', type: 'address' },
	//   { name: 'salt', type: 'bytes32' },
	// ],
	return {
		types: {
			TrustedForwarder: [
				{ name: 'owner', type: 'string' },
				{ name: 'forwarder', type: 'string' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint256' },
			],
		},
		primaryType: 'TrustedForwarder',
		domain: {
			chainId: chainId,
			name: 'AcknowledgementOfRegistry',
			verifyingContract: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
			version: '4',
			salt: DOMAIN_SALTS.ACKNOWLEDGEMENT_OF_REGISTRY,
		},
		value: {
			owner: localState.address,
			forwarder: localState.trustedRelayer,
			deadline,
			nonce: nonce,
		},
	};
};
