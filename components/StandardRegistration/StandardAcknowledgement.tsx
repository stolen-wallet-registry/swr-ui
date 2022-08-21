import { Flex, Spacer, CheckboxGroup, Checkbox, Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { signTypedDataProps } from '@hooks/use712Signature';
import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryAbi } from '@wallet-hygiene/swr-contracts';
import { useState, useEffect } from 'react';
import { useContractReads } from 'wagmi';

interface StadandardAcknowledgementProps extends RegistrationStateManagemenetProps {
	address: string;
	isConnected: boolean;
	onOpen: () => void;
}

const StandardAcknowledgement: React.FC<StadandardAcknowledgementProps> = ({
	setShowStep,
	address,
	isConnected,
	onOpen,
}) => {
	const [includeWalletNFT, setIncludeWalletNFT] = useState<boolean>();
	const [includeSupportNFT, setIncludeSupportNFT] = useState<boolean>();
	const [acknowledgement, setAcknowledgment] = useState<signTypedDataProps>();
	const [isMounted, setIsMounted] = useState(false);
	const { data, isError, isLoading } = useContractReads({
		contracts: [
			{
				addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
				contractInterface: StolenWalletRegistryAbi,
				functionName: 'generateHashStruct',
				args: [address],
			},
			{
				addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
				contractInterface: StolenWalletRegistryAbi,
				functionName: 'nonces',
				args: [address],
			},
			{
				addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
				contractInterface: StolenWalletRegistryAbi,
				functionName: 'ACKNOWLEDGEMENT_TYPEHASH',
			},
			{
				addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
				contractInterface: StolenWalletRegistryAbi,
				functionName: 'REGISTRATION_TYPEHASH',
			},
		],
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		console.log(isError, isLoading, data);
		const buildStruct = async () => {
			// const stollenWalletRegistry = await StolenWalletRegistryFactory.connect(
			// 	CONTRACT_ADDRESSES.local.StolenWalletRegistry,
			// 	signer || provider
			// );
			// const contract = useContract({
			// 	addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
			// 	contractInterface: StolenWalletRegistryAbi,
			// 	signerOrProvider: signer,
			// });
			// console.log(data);
			// const owner = ensData.data || address;
			// const { deadline, hashStruct } = await contract.generateHashStruct(address!);
			// const { deadline, hashStruct } = await hshStructTx.wait();
			// const nonce = await contract.nonces(address!);
			// const nonce = await noncesTx.wait();
			// console.log(owner, nonce, deadline, hashStruct, owner);
			// const struct = await buildAcknowledgementStruct({
			// 	forwarder: address!,
			// 	chainId: Number(chain?.id),
			// 	nonces: nonce.toNumber(),
			// 	deadline,
			// 	owner: owner as string,
			// });
			// setAcknowledgment(struct);
		};
		if (isConnected && isMounted) {
			buildStruct();
		}
	}, [isConnected, address]);

	return (
		<RegistrationSection title="Include NFTs?">
			<Flex>
				<Text mr={20}>
					Include{' '}
					<Text as="span" fontWeight="bold" decoration="underline">
						Supportive
					</Text>{' '}
					NFT?
				</Text>
				<Spacer />
				<CheckboxGroup>
					<Checkbox
						width={[100, 100]}
						isChecked={includeWalletNFT}
						onChange={() => setIncludeWalletNFT(true)}
					>
						Yes
					</Checkbox>
					<Checkbox
						width={[100, 100]}
						onChange={() => setIncludeWalletNFT(false)}
						isChecked={includeWalletNFT === false}
					>
						No
					</Checkbox>
				</CheckboxGroup>
			</Flex>
			<Flex>
				<Text mr={20}>
					Include{' '}
					<Text as="span" fontWeight="bold" decoration="underline">
						Wallet
					</Text>{' '}
					NFT?
				</Text>
				<Spacer />
				<CheckboxGroup>
					<Checkbox
						width={[100, 100]}
						isChecked={includeSupportNFT}
						onChange={() => setIncludeSupportNFT(true)}
					>
						Yes
					</Checkbox>
					<Checkbox
						width={[100, 100]}
						isChecked={includeSupportNFT === false}
						onChange={() => setIncludeSupportNFT(false)}
					>
						No
					</Checkbox>
				</CheckboxGroup>
			</Flex>
			<Flex alignSelf="flex-end">
				<Button m={5} onClick={onOpen}>
					View NFT
				</Button>
				<Button
					m={5}
					onClick={() => setShowStep('grace-period')} // use712Signature(acknowledgement!)
					disabled={
						includeWalletNFT === undefined &&
						includeSupportNFT === undefined &&
						acknowledgement === undefined
					}
				>
					Sign and Pay
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default StandardAcknowledgement;
