import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { BigNumber, Signer } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork } from 'wagmi';

const useRegBlocksLeft = (address: string, signer: Signer) => {
	const { chain } = useNetwork();
	const [expired, setExpired] = useState(false);
	// const [registrationExpiration, setRegistrationExpiration] = useState<Date | null>(null);
	// const [gracePeriodExpiration, setGracePeriodExpiration] = useState<Date | null>(null);
	const [expiryBlock, setExpiryBlock] = useState<BigNumber | null>(null);
	const [startBlock, setStartBlock] = useState<BigNumber | null>(null);
	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
		signer
	);

	const fetchDeadlineBlocks = async () => {
		try {
			const [currentBlock, expiry, start, graceBlcoks, deadlineBlcoks, isExpired] =
				await registryContract.getDeadlines(address);

			setExpiryBlock(expiry);
			setStartBlock(start);
			setExpired(isExpired);

			const nums = [currentBlock, expiry, start, graceBlcoks, deadlineBlcoks].map((n) =>
				n.toNumber()
			);

			console.log(nums, { expired: isExpired });
		} catch (e) {
			console.error(e);
			const now = new Date();
			setExpired(true);
		}
	};

	useEffect(() => {
		fetchDeadlineBlocks();

		const interval = setInterval(() => {
			fetchDeadlineBlocks();
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	return {
		expired,
		expiryBlock,
		startBlock,
	};
};

export default useRegBlocksLeft;

// const fetchDeadlineTime = async () => {
// 	try {
// 		console.log(address);
// 		const s = signer;
// 		const [blockTimestamp, expiryBlock, startBlock, graceSeconds, deadlineSeconds, isExpired] =
// 			await registryContract.getDeadlines(address);
// 		const graceSecnodsLeft = graceSeconds.toNumber() * 1000;
// 		const deadlineSecondsLeft = deadlineSeconds.toNumber() * 1000;
// 		const now = new Date().getTime();
// 		const gracePeriodExpiration = new Date(now + graceSecnodsLeft);
// 		const deadlineExpiration = new Date(now + deadlineSecondsLeft);
// 		setExpired(isExpired);
// 		setBlockTimestamp(blockTimestamp);
// 		setExpiryBlock(expiryBlock);
// 		setStartBlock(startBlock);
// 		setGracePeriodExpiration(gracePeriodExpiration);
// 		setRegistrationExpiration(deadlineExpiration);
// 	} catch (e) {
// 		console.error(e);
// 		const now = new Date();
// 		setExpired(true);
// 		setGracePeriodExpiration(now);
// 		setRegistrationExpiration(now);
// 	}
// };

// const getDetails = async () => {
// 	const registryContract = StolenWalletRegistryFactory.connect(
// 		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
// 		signer!
// 	);

// 	const deadline = await registryContract['getDeadline(address)'](localState.address!);
// 	const startBlock = await registryContract['getStartBlock(address)'](localState.address!);

// 	// setRegistrationExpired(isExpired);
// };
