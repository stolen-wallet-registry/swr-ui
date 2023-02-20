import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { BigNumber, Signer } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork } from 'wagmi';

const useRegBlocksLeft = (address: string, signer: Signer) => {
	const { chain } = useNetwork();
	const [expired, setExpired] = useState(false);
	const [expiryBlock, setExpiryBlock] = useState<BigNumber | null>(null);
	const [startBlock, setStartBlock] = useState<BigNumber | null>(null);
	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry as string,
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
