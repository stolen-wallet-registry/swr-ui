import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { Timer } from '@components/Timer';
import useContractPeriods from '@hooks/useContractPeriods';
import useLocalStorage from '@hooks/useLocalStorage';
import React, { useEffect } from 'react';

interface WaitForRegistrationSignProps {
	setExpiredStep: () => void;
}

const WaitForTRegistrationSign: React.FC<WaitForRegistrationSignProps> = ({ setExpiredStep }) => {
	const [localState, _] = useLocalStorage();
	const { expired, gracePeriodExpiration } = useContractPeriods(localState.address!);

	useEffect(() => {
		if (expired) {
			setExpiredStep();
		}
	}, [expired]);

	return (
		<RegistrationSection title="Wait for Registration Signature">
			{gracePeriodExpiration && (
				<Timer expiry={gracePeriodExpiration} setNextStep={setExpiredStep} />
			)}
			<Text mb={5}>
				We are waiting on peer {localState.connectToPeer} to signature for adding their wallet to
				the registry.
			</Text>
			<Text>
				Once they send their signature over our secure Peer to Peer connection, you will be prompted
				to sign and pay for their registration into the registry.
			</Text>
		</RegistrationSection>
	);
};

export default WaitForTRegistrationSign;
