import React, { useEffect, useState } from 'react';
import { useEnsName, useProvider } from 'wagmi';
import useDebounce from './useDebounce';

const STARTS_WITH_ALPHA = new RegExp('/[a-b][A-B]/');

const useEnsResolver = (ensText: string) => {
	const provider = useProvider({ chainId: 1 });

	const [ensName, setEnsName] = useState<string>(ensText);
	const debouncedEnsName = useDebounce(ensName, 500);
	const [error, setError] = useState({});
	const [resolvedAddress, setResolvedAddress] = React.useState<string>(ensText);

	const checkValidEns = (address: string) => {
		return address?.split('.')?.at(-1) === 'eth';
	};

	const getResolvedAddress = async (addr: string) => {
		try {
			if (STARTS_WITH_ALPHA.test(addr)) {
				const resolver = await provider.getResolver(addr);
				const address = await resolver?.getAddress();
				debugger;
				setResolvedAddress(address!);
			} else {
				debugger;
				setResolvedAddress(addr);
			}
		} catch (error: any) {
			debugger;
			setResolvedAddress(addr);
			setError(error);
			console.error(error);
		}
	};

	useEffect(() => {
		getResolvedAddress(debouncedEnsName);
	}, [debouncedEnsName]);

	return {
		resolvedAddress,
		debouncedEnsName,
		getResolvedAddress,
		setEnsName,
		error,
		checkValidEns,
	};
};

export default useEnsResolver;
