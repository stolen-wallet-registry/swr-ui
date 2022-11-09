import { Button, Flex, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';
import { FaWallet } from 'react-icons/fa';

interface ConnectToPeerProps {
	setConnectToPeerInfo: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		peerId: string,
		multiaddress: string
	) => void;
}

export const ConnectToPeer = ({ setConnectToPeerInfo }: ConnectToPeerProps) => {
	const [localState] = useLocalStorage();
	const [connectPeerId, setConnectPeerId] = React.useState<string>('');
	const [connectPeerAddrs, setConnectPeerAddrs] = React.useState<string>('');

	return (
		<RegistrationSection title="Waiting Trusted Relayer">
			<Text>Please switch to your other account ({localState.trustedRelayer})</Text>
			<Text> so you can pay for the acknowledgement step and proceed</Text>

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
