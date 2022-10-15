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

// localStorage.setDriver(localStorage.LOCALSTORAGE);

const getLocalState = (): StateConfig => {
	const state = JSON.parse(localStorage.getItem(ACCOUNTS_KEY as string) as string);

	// if (!state) {
	//   console.log('no state found');
	//   localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialState));
	//   return initialState;
	// }

	return state;
};

const setLocalState = (args: Partial<StateConfig>) => {
	try {
		const currentState = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) as string);
		localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ ...currentState, ...args }));
	} catch (e) {
		console.log(e);
	}
};

const resetLocalState = (address?: string, network?: number) => {
	localStorage.removeItem(ACCOUNTS_KEY);

	const user = {
		...initialState,
		address,
		network,
		connectedAddress: address,
	};

	localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(user));
};

// const setAccounts = (accounts: AccountConfig[]) => {
// 	try {
// 		localStorage.setItem(ACCOUNTS_KEY, (accts: AccountConfig[]) => [...accts, ...accounts]);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const removeAccount = (address: string) => {
// 	try {
// 		localStorage.setItem(ACCOUNTS_KEY, (accts: AccountConfig[]) =>
// 			accts.filter((acct) => acct.address === address)
// 		);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const deleteRegistration = (address: string, network: number) => {
// 	try {
// 		let user: StateConfig;
// 		localStorage.iterate(
// 			(value, key, _) => {
// 				if (key === (buildKey(address, network))) {
// 					user = (getAddress(address, network)) as StateConfig;
// 					localStorage.removeItem(buildKey(user!.trustedRelayer!, network));
// 					localStorage.removeItem(key);

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
		localStorage.setItem(
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
		const config = localStorage.getItem(buildKey(address, network))!;
		return JSON.parse(config) as StateConfig;
	} catch (error) {
		console.log(error);
	}
};

// const getAccounts = (address: string, network: number) => {
// 	const accts = (localStorage.getItem(ACCOUNTS_KEY)) as AccountConfig[];

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
// 			return localStorage.getItem(buildKey(acct?.address!, acct?.network!));
// 		});

// 		// TODO uhhh
// 		return accounts[0];
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export { getLocalState, setLocalState, resetLocalState };
