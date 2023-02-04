import { Flex, Button, Text, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { buildAcknowledgementStruct } from '@hooks/use712Signature';
import useLocalStorage from '@hooks/useLocalStorage';
import { BigNumber, ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';
import { FaWallet } from 'react-icons/fa';
import { setSignatureWithExpiry, ACKNOWLEDGEMENT_KEY } from '@utils/signature';
import useDebounce from '@hooks/useDebounce';
import { passStreamData, PROTOCOLS } from '@utils/libp2p';
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

		const signatureData = {
			signature: typedSignature?.data!,
			deadline,
			nonce,
			address: localState.address,
			chainId: localState.network,
			keyRef: ACKNOWLEDGEMENT_KEY,
		};

		await passStreamData({
			libp2p,
			localState,
			streamData: signatureData,
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
					disabled={localState.registrationType !== 'standardRelay' && !relayerIsValid}
				>
					Sign
				</Button>
				<Button m={5} onClick={handleStreamSignature} disabled={!typedSignature?.data}>
					Pass Signature
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default AcknowledgeAndSign;
