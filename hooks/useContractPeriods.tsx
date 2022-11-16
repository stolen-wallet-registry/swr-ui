import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { useState, useEffect } from 'react';
import { useNetwork, useSigner } from 'wagmi';

const useContractPeriods = (address: string) => {
	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [expired, setExpired] = useState(false);
	const [registrationExpiration, setRegistrationExpiration] = useState<Date | null>(null);
	const [gracePeriodExpiration, setGracePeriodExpiration] = useState<Date | null>(null);

	const fetchDeadlines = async () => {
		const registryContract = StolenWalletRegistryFactory.connect(
			CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
			signer!
		);

		try {
			const [graceSeconds, deadlineSeconds, isExpired] = await registryContract.getDeadlines(
				address
			);

			debugger;
			const graceSecnodsLeft = graceSeconds.toNumber() * 1000;
			const deadlineSecondsLeft = deadlineSeconds.toNumber() * 1000;

			const now = new Date().getTime();

			const gracePeriodExpiration = new Date(now + graceSecnodsLeft);
			const deadlineExpiration = new Date(now + deadlineSecondsLeft);

			setExpired(isExpired);
			setGracePeriodExpiration(gracePeriodExpiration);
			setRegistrationExpiration(deadlineExpiration);
		} catch (e) {
			console.error(e);

			const now = new Date();
			setExpired(true);
			setGracePeriodExpiration(now);
			setRegistrationExpiration(now);
		}
	};

	useEffect(() => {
		fetchDeadlines();
	}, []);

	return {
		expired,
		registrationExpiration,
		gracePeriodExpiration,
	};
};

export default useContractPeriods;
