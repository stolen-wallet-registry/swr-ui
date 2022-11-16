import { Box, Link, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import NextLink from 'next/link';
import React from 'react';

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

export default WaitForConnection;
