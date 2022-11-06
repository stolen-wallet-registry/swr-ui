import router from 'next/router';
import { useState } from 'react';
import { RegistrationTypes, RegistrationValues } from '../utils/types';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { PeerId } from '@libp2p/interface-peer-id';

export const ACCOUNTS_KEY = '0xswraccts0x';
export const ACKNOWLEDGEMENT_SIGNATURE_KEY = (address: string) => `0xack${address}`;
const ADDRESS_KEY = 'a';
const NO_WINDOW_DETECTED = 'cannot reset state on server';

const buildKey = (address: string, network: number): string => {
	return `${ADDRESS_KEY}-${address}-${network}`;
};

export type StateConfig = {
	connectedAddress: string | null;
	registrationType: RegistrationTypes;
	step: RegistrationValues | null;
	stepSet: boolean;
	address: string | undefined;
	network: number | undefined;
	trustedRelayer: string | null;
	includeWalletNFT: boolean | null;
	includeSupportNFT: boolean | null;
	isRegistering: boolean | null;
	peerId: PeerId | null;
	peerAddrs: Multiaddr[] | null;
	peerPin?: string | null;
	connectToPeer: string | null;
	connectToPeerAddrs: string | null;
	connectToPeerPin?: string | null;
};

export const initialState: StateConfig = {
	connectedAddress: null,
	registrationType: 'standardRelay',
	step: null,
	stepSet: false,
	address: undefined,
	network: undefined,
	trustedRelayer: null,
	includeWalletNFT: null,
	includeSupportNFT: null,
	isRegistering: null,
	peerId: null,
	peerAddrs: [],
	peerPin: null,
	connectToPeer: null,
	connectToPeerAddrs: null,
	connectToPeerPin: null,
};

const useLocalStorage = <T extends StateConfig>(): [
	T,
	(val: Partial<T> | T) => void,
	(address?: string, network?: number) => void
] => {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [localState, setState] = useState<Partial<T> | T>(() => {
		if (typeof window === 'undefined') {
			return initialState;
		}

		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(ACCOUNTS_KEY);
			// Parse stored json or if none return initialState
			if (item) {
				return JSON.parse(item);
			} else {
				console.log('no state found');
				window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialState));
				return initialState;
			}
		} catch (error) {
			// If error also return initialState
			console.log(error);

			if (typeof window !== 'undefined') {
				window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialState));
			}

			return initialState;
		}
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setLocalState = (value: Partial<T> | T) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = { ...localState, ...value };
			// Save state
			setState(valueToStore);
			// Save to local storage
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(valueToStore));
			} else {
				console.error('no window detected');
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error);
		}
	};

	const resetLocalState = (address: string, network: number) => {
		if (typeof window === 'undefined') {
			console.error(NO_WINDOW_DETECTED);
			throw new Error(NO_WINDOW_DETECTED);
		} else {
			window.localStorage.removeItem(ACCOUNTS_KEY);

			const state = {
				...initialState,
				address,
				network,
				connectedAddress: address,
			};

			window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(state));
			router.push('/dapp', undefined, { shallow: true });
		}
	};

	return [localState, setLocalState, resetLocalState] as [
		T,
		(val: Partial<T>) => void,
		(address?: string, network?: number) => void
	];
};

export default useLocalStorage;
