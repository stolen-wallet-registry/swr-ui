import { useState } from 'react';
import { RegistrationTypes, RegistrationValues } from '../utils/types';

export const ACCOUNTS_KEY = '0xswraccts0x';
const ADDRESS_KEY = 'a';

const buildKey = (address: string, network: number): string => {
	return `${ADDRESS_KEY}-${address}-${network}`;
};

export type StateConfig = {
	connectedAddress: string | null;
	registrationType: RegistrationTypes;
	step: RegistrationValues;
	address: string | undefined;
	network: number | undefined;
	trustedRelayer: string | null;
	includeWalletNFT: boolean | null;
	includeSupportNFT: boolean | null;
};

export const initialState: StateConfig = {
	connectedAddress: null,
	registrationType: 'standard',
	step: 'requirements',
	address: '',
	network: undefined,
	trustedRelayer: null,
	includeWalletNFT: null,
	includeSupportNFT: null,
};

const NO_WINDOW_DETECTED = 'cannot reset state on server';

// Usage
// function App() {
//   Similar to useState but first arg is key to the value in local storage.
//   const [name, setName] = useLocalStorage<string>("name", "Bob");
//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//     </div>
//   );
// }

// const getLocalState = (): StateConfig => {
// 	try {
// 		const state = window.localStorage.getItem(ACCOUNTS_KEY as string);

// 		if (state) {
// 			return JSON.parse(state);
// 		} else {
// 			console.log('no state found');
// 			window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialState));
// 			return initialState;
// 		}
// 	} catch (e) {
// 		console.log(e);

// 		throw e;
// 	}
// };

// const setLocalState = (args: Partial<StateConfig>) => {
// 	try {
// 		const currentState = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) as string);

// 		window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ ...currentState, ...args }));
// 		return getLocalState();
// 	} catch (e) {
// 		console.log(e);
// 		throw e;
// 	}
// };

// const resetLocalState = (address?: string, network?: number) => {
// 	window.localStorage.removeItem(ACCOUNTS_KEY);

// 	const user = {
// 		...initialState,
// 		address,
// 		network,
// 		connectedAddress: address,
// 	};

// 	window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(user));
// };

const useLocalStorage = <T extends StateConfig>(): [
	T,
	(val: Partial<T>) => void,
	(address?: string, network?: number) => void
] => {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [localState, setState] = useState<T>(() => {
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
	const setLocalState = (value: Partial<T>) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = { ...localState, ...value };
			// Save state
			setState(valueToStore);
			// Save to local storage
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(valueToStore));
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error);
		}
	};

	const resetLocalState = (address?: string, network?: number) => {
		if (typeof window === 'undefined') {
			console.error(NO_WINDOW_DETECTED);
			throw new Error(NO_WINDOW_DETECTED);
		} else {
			window.localStorage.removeItem(ACCOUNTS_KEY);

			const user = {
				...initialState,
				address,
				network,
				connectedAddress: address,
			};

			window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(user));
		}
	};

	return [localState, setLocalState, resetLocalState] as [
		T,
		(val: Partial<T>) => void,
		(address?: string, network?: number) => void
	];
};

export default useLocalStorage;
