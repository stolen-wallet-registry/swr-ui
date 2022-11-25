import { Text, Box, Link } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { Timer } from '@components/Timer';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { Signer } from 'ethers';
import { Libp2p } from 'libp2p';
import { useNetwork } from 'wagmi';
import NextLink from 'next/link';
import React from 'react';

// Relayer Components
const RelayerSuccess = () => {
	const [localState, _] = useLocalStorage();

	return (
		<RegistrationSection title="Success!">
			<Text mb={5}>You have successfully completeted your job as relayer.</Text>
			<Text mb={5}>
				{localState.trustedRelayerFor!} has been added to the stolen wallet registry.
			</Text>
		</RegistrationSection>
	);
};

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

const WaitForConnection = () => (
	<RegistrationSection title="Waiting for Peer to connect">
		<Text mb={4}>
			You have chosen to assist a <span style={{ fontStyle: 'italics' }}>peer*</span> with
			registering. In order to begin, follow these steps:
		</Text>
		<Box mb={5}>
			<Text>
				1) Copy your <span style={{ fontWeight: 'bold' }}>PeerId</span> and{' '}
				<span style={{ fontWeight: 'bold' }}>Peer Address</span> from the Connection Details.
			</Text>

			<Text>
				2) pass them to your <span style={{ fontStyle: 'italics' }}>peer*</span> through another
				means.
			</Text>
			<Text>
				3) wait for the{' '}
				<span style={{ fontWeight: 'bold' }}>
					peer* you are in contact with to connect to your Peer ID
				</span>
			</Text>
		</Box>
		<Text fontSize="sm" fontStyle="italic">
			<span style={{ fontStyle: 'italics' }}>*Peer</span>: someone you know and trust. You will be
			their <span style={{ fontWeight: 'bold' }}>trusted Relayer or metatransaction provider</span>{' '}
			and assist in paying for them to register on ethereum. for more information, see{' '}
			<NextLink href="https://eips.ethereum.org/EIPS/eip-2771" passHref>
				<Link textDecoration="underline" color="blue" target="_blank">
					EIP 2771
				</Link>
			</NextLink>
			for more information.
		</Text>
	</RegistrationSection>
);

export { RelayerSuccess, WaitForRegistrationSign, WaitForAcknowledgementSign, WaitForConnection };
