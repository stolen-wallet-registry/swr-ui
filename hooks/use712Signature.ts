import { BigNumber } from 'ethers';
import { useSignTypedData } from 'wagmi';

import { CONTRACT_ADDRESSES, DOMAIN_SALTS } from '../utils/constants';
interface Domain712 {
	name: string;
	version: string;
	chainId: number;
	verifyingContract: string;
	salt: string;
}

export interface signTypedDataProps {
	domain: Domain712;
	types: any;
	value: any;
	primaryType: string;
}

interface Domain712Params {
	chainId: number;
}

interface AcknowledgementValues extends Domain712Params {
	forwarder: string;
	owner: string;
	nonces: number;
	deadline: BigNumber;
}

export const buildAcknowledgementStruct = async ({
	forwarder,
	chainId,
	owner,
	nonces,
	deadline,
}: AcknowledgementValues): Promise<signTypedDataProps> => {
	// const [signer, setSigner] = useState<ethers.Signer>();
	// const provider = useProvider();
	// const { connector, address } = useAccount({
	// 	onConnect({ address, connector, isReconnected }) {
	// 		console.log('Connected', { address, connector, isReconnected });
	// 	},
	// });
	// const ensData = useEnsName({
	// 	address,
	// 	chainId: 1,
	// });

	// useSigner({
	// 	onSuccess: (wallet) => {
	// 		setSigner(wallet!);
	// 	},
	// });

	// const stollenWalletRegistry = await StolenWalletRegistryFactory.connect(
	// 	CONTRACT_ADDRESSES.local.StolenWalletRegistry,
	// 	signer || provider
	// );

	// const contract = useContract({
	// 	addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
	// 	contractInterface: AcknowledgementSignatureAbi,
	// 	signerOrProvider: signer,
	// });

	// const owner = ensData.data || address;
	// const { deadline, hashStruct } = await stollenWalletRegistry.generateHashStruct(forwarder);
	// const nonces = await stollenWalletRegistry.nonces(address!);

	return {
		domain: {
			chainId: chainId,
			name: 'AcknowledgementOfRegistry',
			verifyingContract: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
			version: '4',
			salt: DOMAIN_SALTS.ACKNOWLEDGEMENT_OF_REGISTRY,
		},
		primaryType: 'TrustedForwarder',
		types: {
			EIP712Domain: [
				{ name: 'name', type: 'string' },
				{ name: 'version', type: 'string' },
				{ name: 'chainId', type: 'uint256' },
				{ name: 'verifyingContract', type: 'address' },
				{ name: 'salt', type: 'bytes32' },
			],
			TrustedForwarder: [
				{ name: 'owner', type: 'string' },
				{ name: 'forwarder', type: 'string' },
				{ name: 'nonce', type: 'number' },
				{ name: 'deadline', type: 'number' },
			],
		},
		value: {
			owner,
			forwarder,
			nonce: nonces + 1,
			deadline: deadline,
		},
	};
};

export const use712Signature = ({ domain, types, value }: signTypedDataProps): string => {
	const { data, isError, isLoading, isSuccess, signTypedData } = useSignTypedData({
		domain,
		types,
		value,
	});

	console.log(data, isError, isLoading, isSuccess, signTypedData);

	return data as string;
};
