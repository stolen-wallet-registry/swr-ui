import { Chain } from '@rainbow-me/rainbowkit';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { Signer } from 'ethers';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { StateConfig, ACCOUNTS_KEY, accessLocalStorage } from './useLocalStorage';
interface Domain712 {
	name: string;
	version: string;
	chainId: number;
	verifyingContract: `0x${string}`;
  salt: `0x${string}`;
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
	const localState: StateConfig = accessLocalStorage();

	const stollenWalletRegistry = new StolenWalletRegistryFactory(signer as Signer).attach(
		CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry
	);

	if (!chain?.id) {
		throw new Error('Chain ID not found');
	}

	if (!address || !localState.trustedRelayer) {
		throw new Error('Missing required data');
	}

	const { deadline } = await stollenWalletRegistry.generateHashStruct(localState.trustedRelayer);
	const nonce = await stollenWalletRegistry.nonces(address!);

	return {
		types: {
			AcknowledgementOfRegistry: [
				{ name: 'owner', type: 'address' },
				{ name: 'forwarder', type: 'address' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint256' },
			],
		},
		primaryType: 'AcknowledgementOfRegistry',
		domain: {
			name: 'AcknowledgementOfRegistry',
			version: '4',
			chainId: chain?.id!,
			verifyingContract: CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry,
      salt: "0xe7e338c8a96606d405ae49875289174c38181bda641043e953b12964ad115f49"
		},
		value: {
			owner: address,
			forwarder: localState.trustedRelayer,
			nonce,
			deadline,
		},
	};
};

export const buildRegistrationStruct = async ({
	signer,
	chain,
	address,
}: AcknowledgementValues): Promise<signTypedDataProps> => {
	const localState: StateConfig = accessLocalStorage();

	const stollenWalletRegistry = new StolenWalletRegistryFactory(signer as Signer).attach(
		CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry
	);

	if (!chain?.id) {
		throw new Error('Chain ID not found');
	}

	if (!address || !localState.trustedRelayer) {
		throw new Error('Missing required data');
	}

	const { deadline } = await stollenWalletRegistry.generateHashStruct(localState.trustedRelayer);
	const nonce = await stollenWalletRegistry.nonces(address);

	return {
		types: {
			Registration: [
				{ name: 'owner', type: 'address' },
				{ name: 'forwarder', type: 'address' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint256' },
			],
		},
		primaryType: 'Registration',
		domain: {
			name: 'Registration',
			version: '4',
			chainId: chain?.id!,
			verifyingContract: CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry,
      salt: "0x86fdecd3151a18dd477feb379432be4107d347c2ee6bc63ca6212c6d674c17f9"
		},
		value: {
			owner: address,
			forwarder: localState.trustedRelayer,
			nonce,
			deadline,
		},
	};
};
