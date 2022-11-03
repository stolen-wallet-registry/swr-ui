import {
	Flex,
	Spacer,
	CheckboxGroup,
	Checkbox,
	InputGroup,
	InputLeftElement,
	Input,
	Button,
	Text,
} from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';
import { FaWallet } from 'react-icons/fa';
import RegistrationSection from './RegistrationSection';

interface AcknowledgementFormProps {
	handleSignature: () => void;
	relayerIsValid: boolean;
	handleChangeRelayer: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onOpen: () => void;
	relayer: string;
}

export const AcknowledgementForm = ({
	handleSignature,
	relayerIsValid = true,
	handleChangeRelayer,
	onOpen,
	relayer,
}: AcknowledgementFormProps) => {
	const [localState, setLocalState] = useLocalStorage();

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
			{localState.registrationType !== 'standardRelay' && (
				<Flex flexDirection="column">
					<Text>What is your other wallet address?</Text>
					<InputGroup>
						<InputLeftElement pointerEvents="none" children={<FaWallet color="gray.300" />} />
						<Input
							value={relayer}
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
					onClick={handleSignature}
					disabled={
						localState.includeWalletNFT === null ||
						localState.includeSupportNFT === null ||
						// acknowledgement === null ||
						(localState.registrationType !== 'standardRelay' && !relayerIsValid)
					}
				>
					Sign and Pay
				</Button>
			</Flex>
		</RegistrationSection>
	);
};
