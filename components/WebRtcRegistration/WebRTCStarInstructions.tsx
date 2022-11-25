import { Link, Text, Flex, Button } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';
import NextLink from 'next/link';
import React from 'react';

export const WebRTCStarInstructions = () => {
	const [_, setLocalState] = useLocalStorage();
	return (
		<>
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
				<NextLink href="/dapp/p2pRelay/connection" passHref>
					<Button
						onClick={() =>
							setLocalState({
								step: P2PRelayerSteps.WaitForConnection,
								isRegistering: false,
							})
						}
						_active={{ transform: 'translateY(-2px) scale(1.2)' }}
					>
						Assist with Registration
					</Button>
				</NextLink>
				<NextLink href="/dapp/p2pRelay/connection" passHref>
					<Button
						onClick={() =>
							setLocalState({
								step: P2PRegistereeSteps.ConnectToPeer,
								isRegistering: true,
							})
						}
						_active={{ transform: 'translateY(-2px) scale(1.2)' }}
					>
						Register Wallet
					</Button>
				</NextLink>
			</Flex>
		</>
	);
};

export default WebRTCStarInstructions;
