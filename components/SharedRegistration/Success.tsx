import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';

interface P2PInterface {
	isRegistering: boolean;
	relayerFor: string;
	peer: string;
	address: string;
}

const P2PSuccess: React.FC<P2PInterface> = ({ isRegistering, relayerFor, peer, address }) => {
	return isRegistering ? (
		<>
			<Text mb={5}>You have successfully completeted your job as relayer.</Text>
			<Text mb={5}>{relayerFor} has been added to the stolen wallet registry.</Text>
		</>
	) : (
		<>
			<Text mb={5}>Your peer, {peer} has successfully settled the transaction!</Text>
			<Text>You have successfully registered {address} to the Stolen Wallet Registry.</Text>
		</>
	);
};

const Success = () => {
	const [localState, _] = useLocalStorage();
	const { address, trustedRelayerFor, connectToPeer, isRegistering } = localState;

	return (
		<RegistrationSection title="Success!">
			{localState.registrationType === 'p2pRelay' && (
				<P2PSuccess
					isRegistering={isRegistering!}
					relayerFor={trustedRelayerFor!}
					peer={connectToPeer!}
					address={address!}
				/>
			)}
			{localState.registrationType !== 'p2pRelay' && (
				<Text>You have successfully registered {address} to the Stolen Wallet Registry.</Text>
			)}
		</RegistrationSection>
	);
};

export default Success;
