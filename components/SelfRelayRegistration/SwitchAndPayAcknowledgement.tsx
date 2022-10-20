import React, { useEffect, useState } from 'react';
import { Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useAccount } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';

const SwitchAndPayAcknowledgement: React.FC = () => {
	const [_, setLocalState] = useLocalStorage();
	const [isMounted, setIsMounted] = useState(false);
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const storedTrustedRelayer = localStorage.getItem('trustedRelayer');

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted || !isConnected) {
		return null;
	}

	if (isConnected && address !== storedTrustedRelayer) {
		return (
			<RegistrationSection title="Waiting Trusted Relayer">
				<Text>Please switch to your other account ({storedTrustedRelayer})</Text>
				<Text> so you can pay for the acknowledgement step and proceed</Text>
				<Button onClick={() => setLocalState({ step: 'acknowledge-and-sign' })}>Back</Button>
			</RegistrationSection>
		);
	}

	return (
		<RegistrationSection title="Pay for Registration">
			<div>SwitchAndPay</div>
			<Button onClick={() => setLocalState({ step: 'acknowledge-and-sign' })}>Back</Button>
		</RegistrationSection>
	);
};

export default SwitchAndPayAcknowledgement;
