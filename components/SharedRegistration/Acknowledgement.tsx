import { PhoneIcon } from '@chakra-ui/icons';
import {
	Flex,
	Spacer,
	CheckboxGroup,
	Checkbox,
	Button,
	Text,
	Input,
	InputGroup,
	InputLeftElement,
	Box,
} from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { signTypedDataProps } from '@hooks/use712Signature';
import useLocalStorage from '@hooks/useLocalStorage';
import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { ACCOUNTS_KEY } from '@utils/localStore';
import { RegistrationTypes } from '@utils/types';
import { StolenWalletRegistryAbi } from '@wallet-hygiene/swr-contracts';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useContractReads, useEnsName } from 'wagmi';

interface AcknowledgementProps {
	registrationType: RegistrationTypes;
	address: string;
	isConnected: boolean;
	onOpen: () => void;
	setNextStep: () => void;
}

const Acknowledgement: React.FC<AcknowledgementProps> = ({
	registrationType,
	address,
	isConnected,
	onOpen,
	setNextStep,
}) => {
	const [localState, setLocalState] = useLocalStorage(ACCOUNTS_KEY, {});
	const [acknowledgement, setAcknowledgment] = useState<signTypedDataProps>();

	const ensData = useEnsName({
		address,
		chainId: 1,
	});

	const [trustedRelayer, setTrustedRelayer] = useState('');
	const [relayerIsValid, setRelayerIsValid] = useState(true);

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

	const handleChangeRelayer = (e: any) => {
		// TODO handle ens address
		setTrustedRelayer(e.target.value);
		setRelayerIsValid(ethers.utils.isAddress(e.target.value));
	};

	const handleSignAndPay = async () => {
		// use712Signature(acknowledgement!)
		setLocalState({ trustedRelayer });
		setNextStep();
	};

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
						isChecked={localState.includeWalletNFT === true}
						isRequired={true}
						onChange={() => setLocalState({ includeWalletNFT: true })}
					>
						Yes
					</Checkbox>
					<Checkbox
						width={[100, 100]}
						isRequired={true}
						onChange={() => setLocalState({ includeWalletNFT: false })}
						isChecked={localState.includeWalletNFT === false}
					>
						No
					</Checkbox>
				</CheckboxGroup>
			</Flex>
			<Flex mb={5}>
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
						isRequired={true}
						isChecked={localState.includeSupportNFT === true}
						onChange={() => setLocalState({ includeSupportNFT: true })}
					>
						Yes
					</Checkbox>
					<Checkbox
						width={[100, 100]}
						isChecked={localState.includeSupportNFT === false}
						isRequired={true}
						onChange={() => setLocalState({ includeSupportNFT: false })}
					>
						No
					</Checkbox>
				</CheckboxGroup>
			</Flex>
			{registrationType !== 'standard' && (
				<Flex flexDirection="column">
					<Text>What is your other wallet address?</Text>
					<InputGroup>
						<InputLeftElement pointerEvents="none" children={<FaWallet color="gray.300" />} />
						<Input
							value={trustedRelayer}
							placeholder="Trusted Relayer"
							size="md"
							isRequired
							focusBorderColor="black.700"
							isInvalid={!relayerIsValid}
							onChange={handleChangeRelayer}
						/>
					</InputGroup>
					<Text fontSize="sm">
						*Once you sign, you will need to Switch to this wallet before proceeding.
					</Text>
					<Text fontSize="sm">
						**you will use the "Trusted Relayer" wallet to pay for the Registration.
					</Text>
				</Flex>
			)}
			<Flex alignSelf="flex-end">
				<Button m={5} onClick={onOpen}>
					View NFT
				</Button>
				<Button
					m={5}
					onClick={handleSignAndPay}
					disabled={
						localState.includeWalletNFT === undefined ||
						localState.includeSupportNFT === undefined ||
						// acknowledgement === undefined ||
						!relayerIsValid
					}
				>
					Sign and Pay
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default Acknowledgement;
