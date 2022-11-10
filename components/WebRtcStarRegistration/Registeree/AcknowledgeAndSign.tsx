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
import { buildAcknowledgementStruct } from '@hooks/use712Signature';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { BigNumber, ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';
import { Stream } from '@libp2p/interface-connection';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { pipe } from 'it-pipe';
import { FaWallet } from 'react-icons/fa';
import { setSignatureWithExpiry, ACKNOWLEDGEMENT_KEY } from '@utils/signature';
import useDebounce from '@hooks/useDebounce';
import { PROTOCOLS, registereePassSignature } from '@utils/libp2p';
import { Libp2p } from 'libp2p';

interface AcknowledgeAndSignProps {
	libp2p: Libp2p;
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
	tempRelayer: string;
	setTempRelayer: React.Dispatch<React.SetStateAction<string>>;
}

const AcknowledgeAndSign: React.FC<AcknowledgeAndSignProps> = ({
	libp2p,
	address,
	onOpen,
	setNextStep,
	setTempRelayer,
	tempRelayer,
}) => {
	const [relayerIsValid, setRelayerIsValid] = useState(false);
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const [nonce, setNonce] = useState<BigNumber | null>(null);
	const typedSignature = useSignTypedData();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();
	const debouncedTrustedRelayer = useDebounce(tempRelayer, 500);

	const handleStreamSignature = async () => {
		if (!typedSignature?.data || !deadline || !nonce) {
			return;
		}

		await registereePassSignature({
			libp2p,
			localState,
			signature: typedSignature?.data!,
			deadline,
			nonce,
			protocol: PROTOCOLS.ACK_SIG,
		});

		setNextStep();
	};

	const handleChangeRelayer = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempRelayer(e.target.value);
	};

	const handleSignature = async () => {
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
		setRelayerIsValid(ethers.utils.isAddress(debouncedTrustedRelayer));

		if (!relayerIsValid) {
			setLocalState({ trustedRelayer: debouncedTrustedRelayer });
			console.log('relayer not valid');
		}
	}, [debouncedTrustedRelayer]);

	useEffect(() => {
		if (typedSignature.data) {
			// TODO set signature to pass, delete after passing signature
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
			{/* {localState.isRegistering ? ( */}
			<>
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
						onClick={handleSignature}
						disabled={
							localState.includeWalletNFT === null ||
							localState.includeSupportNFT === null ||
							// acknowledgement === null ||
							(localState.registrationType !== 'standardRelay' && !relayerIsValid)
						}
					>
						Sign
					</Button>
					<Button m={5} onClick={handleStreamSignature} disabled={!typedSignature?.data}>
						Pass Signature
					</Button>
				</Flex>
			</>
			{/* // ) : (
			// 	<Flex alignSelf="flex-end">
			// 		<Button
			// 			m={5}
			// 			onClick={() => handleSignAndPay({ signature: typedSignature.data! })}
			// 			disabled={
			// 				localState.includeWalletNFT === null ||
			// 				localState.includeSupportNFT === null ||
			// 				// acknowledgement === null ||
			// 				(localState.registrationType !== 'standardRelay' && !relayerIsValid)
			// 			}
			// 		>
			// 			Pay
			// 		</Button>
			// 	</Flex>
			// )}*/}
		</RegistrationSection>
	);
};

export default AcknowledgeAndSign;
