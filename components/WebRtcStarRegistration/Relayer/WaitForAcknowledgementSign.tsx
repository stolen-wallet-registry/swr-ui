import { Text } from '@chakra-ui/react';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import React, { useEffect } from 'react';
import { Libp2p } from 'libp2p';
import { relayerPostBackMsg } from '@utils/libp2p';
import RegistrationSection from '@components/RegistrationSection';
import { networkInterfaces } from 'os';
import { useNetwork } from 'wagmi';

interface WaitForAcknowledgementSignProps {
	localState: StateConfig;
	libp2p: Libp2p;
}

const WaitForAcknowledgementSign: React.FC<WaitForAcknowledgementSignProps> = ({
	libp2p,
	localState,
}) => {
	const { chain } = useNetwork();

	return (
		<RegistrationSection title="Waiting for Acknowledgement Signature">
			<Text mb={5}>
				waiting on the connected peer to send a signature over our private peer to peer network
				acknowledgeing interaction with this registry.
			</Text>
			<Text>
				Once the signature is recieved, you will be prompted to sign and pay for the transaction in
				order to settle this acknowledgement on{' '}
				<span style={{ fontWeight: 'bold' }}>{chain?.name}.</span>
			</Text>
		</RegistrationSection>
	);
};

export default WaitForAcknowledgementSign;
