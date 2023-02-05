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
import { Timer } from '@components/Timer';
import { buildRegistrationStruct } from '@utils/signature';
import useDebounce from '@hooks/useDebounce';
import useLocalStorage from '@hooks/useLocalStorage';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { REGISTRATION_KEY, setSignatureWithExpiry } from '@utils/signature';
import { BigNumber, ethers, Signer } from 'ethers';
import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';

interface RegistrationProps {
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
	setExpiryStep: () => void;
	signer: Signer;
}

const SwitchAndSignRegistration: React.FC<RegistrationProps> = ({
	address,
	onOpen,
	setNextStep,
	setExpiryStep,
	signer,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const [nonce, setNonce] = useState<BigNumber | null>(null);

	const { expiryBlock } = useRegBlocksLeft(localState.address!, signer);
	const typedSignature = useSignTypedData();
	const { chain } = useNetwork();

	const checkValidEns = (address: string) => {
		return address?.split('.')?.at(-1) === 'eth';
	};

	const handleSign = async () => {
		try {
			const { domain, types, value } = await buildRegistrationStruct({
				signer,
				address,
				chain,
			});

			setDeadline(value.deadline);
			setNonce(value.nonce);

			await typedSignature.signTypedDataAsync({ domain, types, value });
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	useEffect(() => {
		if (typedSignature.data) {
			setSignatureWithExpiry({
				keyRef: REGISTRATION_KEY,
				value: typedSignature.data,
				ttl: deadline!,
				chainId: chain?.id!,
				address: address!,
				nonce: nonce!,
			});

			setNextStep();
		}
	}, [typedSignature.data]);

	if (!signer) {
		return null;
	}

	if (address !== localState.address) {
		return (
			<RegistrationSection title="Waiting Original Singer">
				<Text>Please switch to your other account ({localState.address})</Text>
				<Text> so you can pay for the registration step and proceed</Text>
			</RegistrationSection>
		);
	}

	return (
		<RegistrationSection title="Include NFTs?">
			{expiryBlock && <Timer expiryBlock={expiryBlock} setExpiryStep={setExpiryStep} />}
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
			<Flex alignSelf="flex-end">
				<Button m={5} onClick={onOpen}>
					View NFT
				</Button>
				<Button
					m={5}
					onClick={handleSign}
					disabled={localState.includeWalletNFT === null || localState.includeSupportNFT === null}
				>
					Sign Registration
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default SwitchAndSignRegistration;
