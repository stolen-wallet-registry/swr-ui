import React, { useEffect, useState } from 'react';
import { Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useAccount } from 'wagmi';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import { SelfRelaySteps } from '@utils/types';

interface SwitchAndPayAcknowledgementProps {}

const SwitchAndPayAcknowledgement: React.FC<SwitchAndPayAcknowledgementProps> = ({}) => {
	const [localState, setLocalState] = useLocalStorage();
	const [isMounted, setIsMounted] = useState(false);
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted || !isConnected) {
		return null;
	}

	const backButtonAction = () => {
		setLocalState({ step: SelfRelaySteps.AcknowledgeAndSign });
	};

	if (isConnected && address !== localState.trustedRelayer) {
		return (
			<RegistrationSection title="Waiting Trusted Relayer">
				<Text>Please switch to your other account ({localState.trustedRelayer})</Text>
				<Text> so you can pay for the acknowledgement step and proceed</Text>
				<Button onClick={backButtonAction}>Back</Button>
			</RegistrationSection>
		);
	}

	return (
		<RegistrationSection title="Pay for Acknowledgement">
			<Button onClick={backButtonAction}>Back</Button>
		</RegistrationSection>
	);
};

export default SwitchAndPayAcknowledgement;
