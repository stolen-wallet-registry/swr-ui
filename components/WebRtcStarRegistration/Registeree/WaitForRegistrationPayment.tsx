import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { Timer } from '@components/Timer';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import useLocalStorage from '@hooks/useLocalStorage';
import { Signer } from 'ethers';
import React from 'react';

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

export default WaitForRegistrationPayment;
