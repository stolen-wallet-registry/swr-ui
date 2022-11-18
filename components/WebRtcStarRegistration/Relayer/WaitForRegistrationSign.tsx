import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { Timer } from '@components/Timer';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import useLocalStorage from '@hooks/useLocalStorage';
import { Signer } from 'ethers';
import React, { useEffect } from 'react';

interface WaitForRegistrationSignProps {
	setExpiryStep: () => void;
	address: string;
	signer: Signer;
}

const WaitForRegistrationSign: React.FC<WaitForRegistrationSignProps> = ({
	setExpiryStep,
	address,
	signer,
}) => {
	const [localState, _] = useLocalStorage();
	const { expiryBlock } = useRegBlocksLeft(address, signer);

	return (
		<RegistrationSection title="Wait for Registration Signature">
			{expiryBlock && <Timer expiryBlock={expiryBlock} setExpiryStep={setExpiryStep} />}
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

export default WaitForRegistrationSign;
