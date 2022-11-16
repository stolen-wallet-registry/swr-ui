import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';

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

export default WaitForAcknowledgementPayment;
