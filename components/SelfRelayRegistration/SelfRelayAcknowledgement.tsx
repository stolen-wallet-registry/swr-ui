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
} from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { buildAcknowledgementStruct } from '@utils/signature';
import useDebounce from '@hooks/useDebounce';
import useLocalStorage from '@hooks/useLocalStorage';
import { ACKNOWLEDGEMENT_KEY, setSignatureWithExpiry } from '@utils/signature';
import { BigNumber, ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';

interface AcknowledgementProps {
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
	tempRelayer: string;
	setTempRelayer: React.Dispatch<React.SetStateAction<string>>;
}

const Acknowledgement: React.FC<AcknowledgementProps> = ({
	address,
	onOpen,
	setTempRelayer,
	tempRelayer,
	setNextStep,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const [relayerIsValid, setRelayerIsValid] = useState(false);
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const [nonce, setNonce] = useState<BigNumber | null>(null);
	const debouncedTrustedRelayer = useDebounce(tempRelayer, 500);

	const typedSignature = useSignTypedData();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();

	const checkValidEns = (address: string) => {
		return address?.split('.')?.at(-1) === 'eth';
	};

	const handleChangeRelayer = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempRelayer(e.target.value);
	};

	const handleSign = async () => {
		try {
			const { domain, types, value } = await buildAcknowledgementStruct({
				signer,
				address,
				chain,
			});

			setDeadline(value.deadline);
			setNonce(value.nonce);
			await typedSignature.signTypedDataAsync({ domain, types, value });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setLocalState({ trustedRelayer: debouncedTrustedRelayer });
		setRelayerIsValid(ethers.utils.isAddress(debouncedTrustedRelayer));
	}, [debouncedTrustedRelayer]);

	useEffect(() => {
		if (typedSignature.data) {
			setSignatureWithExpiry({
				keyRef: ACKNOWLEDGEMENT_KEY,
				value: typedSignature.data,
				ttl: deadline!,
				chainId: chain?.id!,
				address: address!,
				nonce: nonce!,
			});
			setNextStep();
		}
	}, [typedSignature.data]);

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
			<Flex flexDirection="column">
				<Text>What is your other wallet address?</Text>
				<InputGroup>
					<InputLeftElement pointerEvents="none" children={<FaWallet color="gray.300" />} />
					<Input
						value={tempRelayer}
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
			<Flex alignSelf="flex-end">
				<Button m={5} onClick={onOpen}>
					View NFT
				</Button>
				<Button
					m={5}
					onClick={handleSign}
					disabled={
						localState.includeWalletNFT === null ||
						localState.includeSupportNFT === null ||
						!relayerIsValid
					}
				>
					Sign Acknowledgement
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default Acknowledgement;
