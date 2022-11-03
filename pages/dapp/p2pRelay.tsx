import { Text, Flex, Link, Button } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import RegistrationSection from '@components/RegistrationSection';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import NextLink from 'next/link';
import React, { useState } from 'react';

interface WebRTCStarInterface {
	onOpen: () => void;
}

const Web: React.FC<WebRTCStarInterface> = ({ onOpen }) => {
	const handleOnStartRegistery = () => {
		// do something
	};

	const handleOnStartRelayer = () => {
		// do something
	};

	return (
		<DappLayout
			heading="Peer to Peer Relay"
			subHeading="sign with one wallet, have your peer pay for you."
		>
			<Flex mt={20} mb={10} p={10} gap={5}>
				<CompletionSteps />
				<RegistrationSection title="Requirements for p2p">
					<Flex flexDirection="column" mb={5}>
						<Text mb={5}>To register through p2p, you will need:</Text>
						<Text>1) A friend who is willing to pay for you</Text>
						<Text>
							2) that friend will visit{' '}
							<NextLink href="dapp/p2pRelay" passHref>
								<Link color="blue" textDecoration="underline">
									{process.env.NEXT_PUBLIC_DOMAIN}/dapp/p2pRelay
								</Link>
							</NextLink>
						</Text>
						<Text>
							3) that friend will have to click <Text as="b">Assist with Registration</Text>.
						</Text>
					</Flex>
					<Flex justifyContent="space-between">
						<Button
							onClick={handleOnStartRelayer}
							_active={{ transform: 'translateY(-2px) scale(1.2)' }}
						>
							Assist with Registration
						</Button>
						<Button
							onClick={handleOnStartRegistery}
							_active={{ transform: 'translateY(-2px) scale(1.2)' }}
						>
							Register Wallet
						</Button>
					</Flex>
				</RegistrationSection>
			</Flex>
		</DappLayout>
	);
};

export default Web;
