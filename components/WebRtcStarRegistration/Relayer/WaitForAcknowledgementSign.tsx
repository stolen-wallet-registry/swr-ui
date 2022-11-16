import { Text } from '@chakra-ui/react';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import React, { useEffect } from 'react';
import { Libp2p } from 'libp2p';
import { relayerPostBackMsg } from '@utils/libp2p';
import RegistrationSection from '@components/RegistrationSection';

interface WaitForAcknowledgementSignProps {
	localState: StateConfig;
	libp2p: Libp2p;
}

const WaitForAcknowledgementSign: React.FC<WaitForAcknowledgementSignProps> = ({
	libp2p,
	localState,
}) => {
	return (
		<RegistrationSection title="Waiting for Acknowledgement Signature">
			<Text>Stuff</Text>
		</RegistrationSection>
	);
};

export default WaitForAcknowledgementSign;
