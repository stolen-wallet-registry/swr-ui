import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { Timer } from '@components/Timer';
import useLocalStorage from '@hooks/useLocalStorage';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { Signer } from 'ethers';
import React from 'react';
import { FaWallet } from 'react-icons/fa';

// Registeree Components
interface WaitForRegistrationPaymentProps {
	address: string;
	signer: Signer;
	setExpiryStep: () => void;
}

const WaitForRegistrationPayment: React.FC<WaitForRegistrationPaymentProps> = ({
	address,
	signer,
	setExpiryStep,
}) => {
	const [localState, _] = useLocalStorage();
	const { expiryBlock } = useRegBlocksLeft(address, signer);

	return (
		<RegistrationSection title="Waiting on Peer Payment">
			{expiryBlock && <Timer expiryBlock={expiryBlock!} setExpiryStep={setExpiryStep} />}
			<Text mb={5}>
				Waiting for {localState.trustedRelayer} to pay for your wallet, {address}, to be registered
			</Text>
			<Text>wait here until this action has completed.</Text>
		</RegistrationSection>
	);
};

const RegistreeSuccess = () => {
	const [localState, _] = useLocalStorage();

	// TODO: add order view to page -- if bought nft, display nfts.
	return (
		<RegistrationSection title="Success!">
			<Text mb={5}>
				Your peer, {localState.connectToPeer} has successfully settled the transaction!
			</Text>
			<Text>
				You have successfully registered {localState.address} to the Stolen Wallet Registry.
			</Text>
		</RegistrationSection>
	);
};

const WaitForAcknowledgementPayment = () => {
	const [localState, setLocalState] = useLocalStorage();
	return (
		<RegistrationSection title="Wait for Acknowledgement Payment">
			<Text>
				Waiting for peer{' '}
				<span style={{ fontWeight: 'bold' }}>{localState.connectToPeer!.toString()}</span>
			</Text>
			<Text mb={5}>to pay for your acknowledgement.</Text>
			<Text>
				Once your peer makes this payment, the{' '}
				<span style={{ fontWeight: 'bold' }}>
					smart contract will determine a random amount of time we must wait
				</span>{' '}
				to finish registration. This is known as the{' '}
				<span style={{ fontWeight: 'bold' }}>Grace Period.</span>
			</Text>
		</RegistrationSection>
	);
};

interface ConnectToPeerProps {
	setConnectToPeerInfo: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		peerId: string,
		multiaddress: string
	) => void;
}

const ConnectToPeer = ({ setConnectToPeerInfo }: ConnectToPeerProps) => {
	const [localState] = useLocalStorage();
	const [connectPeerId, setConnectPeerId] = React.useState<string>('');
	const [connectPeerAddrs, setConnectPeerAddrs] = React.useState<string>('');

	return (
		<RegistrationSection title="Connect to Peer">
			<Box mb={5}>
				<Text>
					1) Have someone you know visit the{' '}
					<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
						Stollen Wallet Registry
					</span>
				</Text>
				<Text>
					2) Instruct them to visit{' '}
					<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>P2P Relay</span> and
					click{' '}
					<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
						Assist with Registration
					</span>
				</Text>
				<Text>
					3) get their{' '}
					<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
						Peer ID and Connection Address offline
					</span>
				</Text>
				<Text>4) Paste them here to connect.</Text>
			</Box>
			<Flex flexDirection="column" gap={3}>
				<InputGroup>
					<InputLeftElement pointerEvents="none" children={<FaWallet color="gray.300" />} />
					<Input
						value={connectPeerId.toString()}
						placeholder="You friends Peer ID"
						size="md"
						isRequired
						onChange={(e) => setConnectPeerId(e.target.value)}
						focusBorderColor="black.700"
					/>
				</InputGroup>
				<InputGroup>
					<InputLeftElement pointerEvents="none" children={<FaWallet color="gray.300" />} />
					<Input
						value={connectPeerAddrs}
						placeholder="Your Friends Connection Address"
						size="md"
						isRequired
						onChange={(e) => setConnectPeerAddrs(e.target.value)}
						focusBorderColor="black.700"
					/>
				</InputGroup>
				<Button
					isDisabled={!connectPeerId && !connectPeerAddrs}
					onClick={(e) => setConnectToPeerInfo(e, connectPeerId, connectPeerAddrs)}
				>
					Set Connection Info
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export {
	WaitForRegistrationPayment,
	RegistreeSuccess,
	WaitForAcknowledgementPayment,
	ConnectToPeer,
};
