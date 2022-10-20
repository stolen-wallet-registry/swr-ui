import { RegistrationTypes, RegistrationValues } from './types';

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

const useLocalStorage = <T extends StateConfig>(
	key: string,
	initialValue: Partial<T>
): [T, (val: Partial<T>) => void] => {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue;
		}

		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			// If error also return initialValue
			console.log(error);
			return initialValue;
		}
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value: Partial<T>) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = { ...storedValue, ...value };
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error);
		}
	};
	return [storedValue, setValue] as [T, (val: Partial<T>) => void];
};

export default useLocalStorage;

// window.localStorage.setDriver(window.localStorage.LOCALSTORAGE);

const getLocalState = (): StateConfig => {
	try {
		const state = window.localStorage.getItem(ACCOUNTS_KEY as string);

		if (state) {
			return JSON.parse(state);
		} else {
			console.log('no state found');
			window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialState));
			return initialState;
		}
	} catch (e) {
		console.log(e);

		throw e;
	}
};

const setLocalState = (args: Partial<StateConfig>) => {
	try {
		const currentState = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) as string);
		debugger;
		window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ ...currentState, ...args }));
		return getLocalState();
	} catch (e) {
		console.log(e);
		throw e;
	}
};

const resetLocalState = (address?: string, network?: number) => {
	window.localStorage.removeItem(ACCOUNTS_KEY);

	const user = {
		...initialState,
		address,
		network,
		connectedAddress: address,
	};

	window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(user));
};

// const setAccounts = (accounts: AccountConfig[]) => {
// 	try {
// 		window.localStorage.setItem(ACCOUNTS_KEY, (accts: AccountConfig[]) => [...accts, ...accounts]);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const removeAccount = (address: string) => {
// 	try {
// 		window.localStorage.setItem(ACCOUNTS_KEY, (accts: AccountConfig[]) =>
// 			accts.filter((acct) => acct.address === address)
// 		);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const deleteRegistration = (address: string, network: number) => {
// 	try {
// 		let user: StateConfig;
// 		window.localStorage.iterate(
// 			(value, key, _) => {
// 				if (key === (buildKey(address, network))) {
// 					user = (getAddress(address, network)) as StateConfig;
// 					window.localStorage.removeItem(buildKey(user!.trustedRelayer!, network));
// 					window.localStorage.removeItem(key);

// 					removeAccount(user.address);
// 					removeAccount(user.trustedRelayer!);
// 				}
// 			},
// 			(result) => {
// 				console.log(result);
// 			}
// 		);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const setAddress = (state: StateConfig) => {
	try {
		window.localStorage.setItem(
			buildKey(state.address!, state.network!),
			JSON.stringify({
				address: state.address,
				trustedRelayer: state.trustedRelayer,
				network: state.network,
				registrationType: state.registrationType,
				currentStep: state.step,
				includeWalletNFT: state.includeWalletNFT,
				includeSupportNFT: state.includeSupportNFT,
			})
		);
	} catch (error) {
		console.log(error);
	}
};

const getAddress = (address: string, network: number): StateConfig | unknown => {
	try {
		const config = window.localStorage.getItem(buildKey(address, network))!;
		return JSON.parse(config) as StateConfig;
	} catch (error) {
		console.log(error);
	}
};

// const getAccounts = (address: string, network: number) => {
// 	const accts = (window.localStorage.getItem(ACCOUNTS_KEY)) as AccountConfig[];

// 	if (accts.length === 0) {
// 		setAddress({ ...initialState, address, network });
// 		const acct = (getAddress(address, network)) as StateConfig;
// 		const newAcct = { address: acct.address, network: acct.network!, isRelayer: false };
// 		setAccounts([newAcct]);
// 		accts.push(newAcct);
// 		return accts;
// 	}

// 	return accts.filter((account) => {
// 		if (account.address === address && account.isRelayer) {
// 			return accts.some((a) => {
// 				if (!a.isRelayer) {
// 					const user = getAddress(a.address, network);
// 					user!.trustedRelayer === address;
// 				}
// 			});
// 		} else {
// 			return account.address === address && !account.isRelayer;
// 		}
// 	});
// };

// const findCurrentAddress = (address: string, network: number) => {
// 	try {
// 		let accounts: AccountConfig[];
// 		accounts = getAccounts(address, network);

// 		accounts.map((acct) => {
// 			return window.localStorage.getItem(buildKey(acct?.address!, acct?.network!));
// 		});

// 		// TODO uhhh
// 		return accounts[0];
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export { getLocalState, setLocalState, resetLocalState };
