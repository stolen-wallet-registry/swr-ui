import { BigNumber } from 'ethers';
import { TypedDataDomain } from 'abitype';
import { Chain } from '@rainbow-me/rainbowkit';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { Signer } from 'ethers';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { StateConfig, accessLocalStorage } from '@hooks/useLocalStorage';
import { String0x } from './types';

export type KEY_REF_TYPES = '0xack' | '0xreg';
export const ACKNOWLEDGEMENT_KEY = '0xack';
export const REGISTRATION_KEY = '0xreg';

export const buildAcknowledgementKey = (address: string, network: number): string => {
	return `${ACKNOWLEDGEMENT_KEY}-${address}-${network}`;
};

export const buildRegistertKey = (address: string, network: number): string => {
	return `${REGISTRATION_KEY}-${address}-${network}`;
};

interface getSignatureProps {
	keyRef: string;
	chainId: number;
	address: string;
}

interface UseableSignatureProps {
	value: string;
	deadline: BigNumber;
	nonce: BigNumber;
}

export interface setLocalStorageProps extends getSignatureProps {
	value: string;
	deadline: BigNumber;
	deadlineDate?: Date;
	nonce: BigNumber;
}

interface setSignatureProps extends getSignatureProps {
	value: any;
	ttl: BigNumber;
	nonce: BigNumber;
}

export const setSignatureLocalStorage = ({
	keyRef,
	chainId,
	address,
	value,
	deadline,
	nonce,
}: setLocalStorageProps) => {
	console.log(keyRef, chainId, address, value, deadline, nonce);
	const item = {
		value,
		deadline,
		startTimeDate: new Date(Date.now() + 1 * 60 * 1000), // TODO come  back to this and insert startTime.
		deadlineDate: new Date(Date.now() + 6 * 60 * 1000), // TODO come  back to this and insert deadline.
		nonce,
	};

	try {
		if (keyRef === ACKNOWLEDGEMENT_KEY) {
			localStorage.setItem(buildAcknowledgementKey(address, chainId), JSON.stringify(item));
		} else if (keyRef === REGISTRATION_KEY) {
			localStorage.setItem(buildRegistertKey(address, chainId), JSON.stringify(item));
		} else {
			throw new Error('please use a valid key');
		}
	} catch (e) {
		console.log(e);
		throw e;
	}
};

export const setSignatureWithExpiry = ({
	keyRef,
	value,
	ttl,
	chainId,
	address,
	nonce,
}: setSignatureProps): void => {
	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	// TODO for some reason the time is using an hour ahead - fix this.
	// const oneHour = 1 * 60 * 60;
	const time = ttl; // .toNumber() + oneHour;
	const item = {
		value: value,
		deadline: time,
		startTime: new Date(Date.now() + 1 * 60 * 1000), // TODO come  back to this and insert startTime.
		deadlineDate: new Date(Date.now() + 6 * 60 * 1000), // TODO come  back to this and insert deadline.
	};

	setSignatureLocalStorage({
		keyRef,
		chainId,
		address,
		value,
		deadline: ttl,
		nonce,
	});
};

export const getSignatureWithExpiry = ({
	keyRef,
	chainId,
	address,
}: getSignatureProps): UseableSignatureProps => {
	let itemStr: any | string = '';

	try {
		if (keyRef === ACKNOWLEDGEMENT_KEY) {
			itemStr = localStorage.getItem(buildAcknowledgementKey(address!, chainId)) as string;
		} else if (keyRef === REGISTRATION_KEY) {
			itemStr = localStorage.getItem(buildRegistertKey(address!, chainId)) as string;
		} else {
			throw new Error('please use a valid key');
		}
	} catch (e) {
		console.log(e);
		throw e;
	}

	// if the item doesn't exist, return null
	if (!itemStr) {
		throw new Error('no item found');
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.deadline) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(itemStr);
		throw new Error(`signature expired`);
	}

	return { value: item.value, deadline: item.deadline, nonce: item.nonce };
};

interface Domain712 {
	name: string;
	version: string;
	chainId: number;
	verifyingContract: string;
	salt: String0x;
}
export interface signTypedDataProps {
	domain: TypedDataDomain;
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
		CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry as string
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
			salt: '0xe7e338c8a96606d405ae49875289174c38181bda641043e953b12964ad115f49',
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
		CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry as string
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
			salt: '0x86fdecd3151a18dd477feb379432be4107d347c2ee6bc63ca6212c6d674c17f9',
		},
		value: {
			owner: address,
			forwarder: localState.trustedRelayer,
			nonce,
			deadline,
		},
	};
};
