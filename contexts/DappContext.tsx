import React, { Dispatch, useContext } from 'react';

interface DappContextInterface {
	loading: boolean;
	setLoading: Dispatch<boolean>;
}

export const DappContext = React.createContext<DappContextInterface>({
	loading: false,
	setLoading: () => undefined,
});

DappContext.displayName = 'DappContext';

export type DappProviderProps = {
	children: React.ReactNode;
};

export const DappProvider = ({ children }: DappProviderProps) => {
	const [loading, setLoading] = React.useState(false);

	return (
		<DappContext.Provider
			value={{
				loading,
				setLoading,
			}}
		>
			{children}
		</DappContext.Provider>
	);
};

export const useDappContext = () => useContext(DappContext);
