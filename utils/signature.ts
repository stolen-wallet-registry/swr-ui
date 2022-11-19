import { BigNumber } from 'ethers';

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