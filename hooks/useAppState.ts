import { ACCOUNTS_KEY, initialState, StateConfig } from '@utils/localStore';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const useAppState = () => {
	// 	const [currentState, setLocalState] = useState<StateConfig>();
	// 	const [isLoading, setIsLoading] = useState<boolean>(false);
	// 	const { chain } = useNetwork();
	// 	const setCurrentState = async (state: Partial<StateConfig>) => {
	// 		const s = await localStore.getState();
	// 		const combinedState = { ...currentState, ...state };
	// 		debugger;
	// 		await localStore.setState(combinedState);
	// 		setLocalState(combinedState as StateConfig);
	// 	};
	// 	const { address, isConnected, isReconnecting } = useAccount({
	// 		onConnect({ address }) {
	// 			// console.log('connecting', address);
	// 			setCurrentState({ connectedAddress: address });
	// 			if (!currentState?.address) {
	// 				setCurrentState({ address });
	// 			}
	// 		},
	// 		onDisconnect() {
	// 			// console.log('disconnecting', address);
	// 			setCurrentState({ connectedAddress: null });
	// 		},
	// 	});
	// 	// useEffect(() => {
	// 	// 	const setUser = async () => {
	// 	// 		const state = await localStore.getState();
	// 	// 		if (!state) {
	// 	// 			const user = { ...initialState, address, network: chain?.id };
	// 	// 			localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(user));
	// 	// 			setLocalState(user);
	// 	// 		} else {
	// 	// 			setLocalState(state);
	// 	// 		}
	// 	// 	};
	// 	// 	if (!currentState) {
	// 	// 		setUser();
	// 	// 	}
	// 	// }, [address]);
	// 	// useEffect(() => {
	// 	// 	if (address) {
	// 	// 		localStore
	// 	// 			.getState()
	// 	// 			.then((currentState: StateConfig) => {
	// 	// 				setLocalState({ ...currentState, connectedAddress: address as string });
	// 	// 			})
	// 	// 			.catch(() => {
	// 	// 				``;
	// 	// 				// handle error
	// 	// 			});
	// 	// 	}
	// 	// }, [address]);
	// 	return {
	// 		address,
	// 		currentState,
	// 		setCurrentState,
	// 		isConnected,
	// 		isReconnecting,
	// 		isLoading,
	// 		setIsLoading,
	// 	};
};

// export default useAppState;
