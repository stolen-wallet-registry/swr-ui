import { Box, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import Link from 'next/link';
import React from 'react';

const WaitForConnection = () => {
	return (
		<RegistrationSection title="Waiting for Peer to connect">
			<Text mb={4}>
				You have chosen to assist a peer* with registering. In order to begin, follow these steps:
			</Text>
			<Box mb={5}>
				<Text>
					1) Copy your <span style={{ fontWeight: 'bold' }}>PeerId</span> and{' '}
					<span style={{ fontWeight: 'bold' }}>Peer Address</span> from the Connection Details.
				</Text>

				<Text>2) pass them to your peer* through another means.</Text>
				<Text>
					3) wait for the{' '}
					<span style={{ fontWeight: 'bold' }}>
						peer* you are in contact with to connect to your Peer ID
					</span>
				</Text>
			</Box>
			<Text fontSize="sm" fontStyle="italic">
				Peer: someone you know and trust. You will be their{' '}
				<span style={{ fontWeight: 'bold' }}>trusted Relayer or metatransaction provider</span> and
				assist in paying for them to register on ethereum. for more information, see{' '}
				<Link
					style={{ textDecoration: 'underline', color: 'blue' }}
					href="https://eips.ethereum.org/EIPS/eip-2771"
					target="_blank"
				>
					EIP 2771
				</Link>
			</Text>
		</RegistrationSection>
	);
};

export default WaitForConnection;
