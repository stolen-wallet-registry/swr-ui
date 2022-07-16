import DappLayout from '../components/DappLayout';

import type { NextPage } from 'next';
import {
	Box,
	Button,
	Flex,
	Heading,
	LightMode,
	SimpleGrid,
	Center,
	useColorMode,
	Highlight,
	OrderedList,
	ListItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface RegistrationSectionProps {
	title: string;
}

type RegistrationSection = 'register' | 'selfRelay' | 'p2pRelay';

const HIGHLIGHT_STYLE = {
	px: '1',
	py: '1',
	rounded: 'full',
	color: 'white',
	bg: 'blackAlpha.900',
};

const Dapp: NextPage = () => {
	const { setColorMode } = useColorMode();
	const minPayment = '0.01';
	const [showSection, setShowSection] = useState<RegistrationSection>('register');
	const { address, isConnected } = useAccount();

	useEffect(() => {
		setColorMode('light');
	}, []);

	const RegistrationSection: React.FC<RegistrationSectionProps> = ({ title, children }) => {
		return (
			<Flex
				borderRadius={10}
				p={5}
				boxShadow="base"
				flexDirection="column"
				border={'5px solid blackAlpha.900'}
			>
				<Heading as="h5" size="md" pb={5} pt={5}>
					{title}
				</Heading>
				{children}
			</Flex>
		);
	};

	const SelfRelayRegistration = () => {
		return <div>self relay</div>;
	};

	const WebRtcDirectRelay = () => {
		return <div>webrtc-direct</div>;
	};

	const StandardRegistration = () => {
		if (!isConnected) {
			return null;
		}
		console.log(address, isConnected);
		return (
			<RegistrationSection title="Standard Registration">
				<Box pb={10}>
					Standard registration is for you if:
					<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
						<ListItem>
							<Highlight key={1} query={[`${address}`]} styles={HIGHLIGHT_STYLE}>
								{`Your connected Wallet (${address}) is compromised.`}
							</Highlight>
						</ListItem>
						<ListItem>
							<Highlight
								key={2}
								query={[`${minPayment}Eth for public goods`, 'supported chains']}
								styles={HIGHLIGHT_STYLE}
							>{`You have ${minPayment}Eth for public goods in your wallet on one of the supported chains.`}</Highlight>
						</ListItem>
					</OrderedList>
				</Box>
				<SimpleGrid columns={[1, 1, 2]}>
					<Center>
						<Button width={[200, 300]} m={5}>
							Supported Chains
						</Button>
					</Center>
					<Center>
						<Button width={[200, 250]} m={5}>
							Begin
						</Button>
					</Center>
				</SimpleGrid>
			</RegistrationSection>
		);
	};

	const ButtonChoices = () => {
		const handleOnClick = (section: RegistrationSection) => {
			setShowSection(section);
		};

		return (
			<Box mt={20} mb={10}>
				<Heading as="h1" size="lg" letterSpacing="0.1em" textAlign="center">
					Registration Options
				</Heading>
				<Heading
					as="h6"
					color="white"
					backgroundColor="blackAlpha.900"
					textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
					boxShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
					size="sm"
					letterSpacing="0.1em"
					textAlign="center"
				>
					The Stolen Wallet Registry
				</Heading>
				<Flex justifyContent="space-around" alignItems="center">
					<SimpleGrid spacing={20} columns={[1, 1, 3]} p={10} gap={5}>
						<Button
							variant="outline"
							width={200}
							disabled={showSection === 'register'}
							onClick={() => handleOnClick('register')}
							_active={{ transform: 'translateY(-2px) scale(1.1)' }}
						>
							Standard
						</Button>
						<Button
							variant="outline"
							width={200}
							disabled={showSection === 'selfRelay'}
							onClick={() => handleOnClick('selfRelay')}
							_active={{ transform: 'translateY(-2px) scale(1.1)' }}
						>
							Self Relay
						</Button>
						<Button
							variant="outline"
							width={200}
							disabled={showSection === 'p2pRelay'}
							onClick={() => handleOnClick('p2pRelay')}
							_active={{ transform: 'translateY(-2px) scale(1.1)' }}
						>
							P2P Relay
						</Button>
					</SimpleGrid>
				</Flex>
				<SimpleGrid spacing={20} columns={[1, 1, 2]} p={10} gap={5}>
					{isConnected ? (
						<>
							{showSection === 'register' && <StandardRegistration />}
							{showSection === 'selfRelay' && <SelfRelayRegistration />}
							{showSection === 'p2pRelay' && <WebRtcDirectRelay />}
						</>
					) : (
						<div>Please Connect to your wallet</div>
					)}
				</SimpleGrid>
			</Box>
		);
	};

	return (
		<LightMode>
			<style jsx global>{`
				body {
					background-color: var(--chakra-colors-white-400) !important;
					transition-property: background-color;
					transition-duration: unset;
				}
			`}</style>
			<DappLayout>
				<ButtonChoices />
			</DappLayout>
		</LightMode>
	);
};

export default Dapp;
