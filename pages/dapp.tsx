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
	Checkbox,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { buildAcknowledgementStruct, use712Signature } from '../hooks/use712Signature';

interface RegistrationSectionProps {
	title: string;
}

type RegistrationSection = 'standard' | 'selfRelay' | 'p2pRelay';
type StandardSteps = 'requirements' | 'acknowledge-and-pay' | 'grace-period' | 'register-and-pay';
type SelfRelaySteps =
	| 'requirements'
	| 'acknowledge'
	| 'switch-and-pay'
	| 'grace-period'
	| 'register-sign'
	| 'switch-and-pay';
type P2PRelaySteps =
	| 'requirements'
	| 'connect-to-peer'
	| 'acknowledge'
	| 'send-to-peer'
	| 'wait-for-peer-init-pay'
	| 'grace-period'
	| 'sign-register'
	| 'send-to-peer'
	| 'wait-for-peer-register-pay';

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
	const [showSection, setShowSection] = useState<RegistrationSection>('standard');
	const { address, isConnected } = useAccount();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setColorMode('light');
		setIsMounted(true);
	}, []);

	const RegistrationSection: React.FC<RegistrationSectionProps> = ({ title, children }) => {
		return (
			<Flex
				width="50%"
				borderRadius={10}
				p={5}
				boxShadow="base"
				flexDirection="column"
				border={'5px solid blackAlpha.900'}
			>
				<Heading size="md" pb={5} pt={5}>
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
		const [includeNFT, setIncludeNFT] = useState<'Yes' | 'No' | null>(null);
		const [showStep, setShowStep] = useState<StandardSteps>('requirements');

		const Requirements = () => {
			return (
				<RegistrationSection title="Standard Registration">
					<Box pb={10}>
						Requirements:
						<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
							<ListItem>
								<Highlight key={address} query={[`${address}`]} styles={HIGHLIGHT_STYLE}>
									{`Your connected Wallet (${address}) is compromised.`}
								</Highlight>
							</ListItem>
							<ListItem>Your are connected to one of the supported chains.</ListItem>
							<ListItem>
								<Highlight
									key={minPayment}
									query={[
										`${minPayment}(Eth|NativeToken)`,
										'supported chains',
										'(Protocol Guild|Retro PG)',
									]}
									styles={HIGHLIGHT_STYLE}
								>{`You have ${minPayment}(Eth|NativeToken) that will go to the (Protocol Guild|Retro PG).`}</Highlight>
							</ListItem>
						</OrderedList>
					</Box>
					<Button
						alignSelf="flex-end"
						width={[200, 250]}
						m={5}
						onClick={() => setShowStep('acknowledge-and-pay')}
					>
						Begin
					</Button>
				</RegistrationSection>
			);
		};

		const CompletionSteps: React.FC = ({ children }) => {
			return (
				<RegistrationSection title="Completion Steps">
					<Box pb={10}>
						<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
							<ListItem>Select value for the optional NFT.</ListItem>
							<ListItem>Sign and pay an "Acknowledgement of Registration" transaction.</ListItem>
							<ListItem>Wait 2-4 minutes grace period before you are allowed to register.</ListItem>
							<ListItem>Sign and pay for your wallet to be added to the Registry.</ListItem>
						</OrderedList>
					</Box>
					{children}
				</RegistrationSection>
			);
		};

		const StandardAcknowledgement = () => {
			const [isAcknowledged, setIsAcknowledged] = useState(false);

			return (
				<CompletionSteps>
					<Box>
						<Box textAlign="right" mr={10}>
							<Text fontSize="14px">(additional $5)</Text>
							<Text fontWeight="bold">Include Optional NFT</Text>
						</Box>
						<Center justifyContent="right" mt={5}>
							<Checkbox
								width={[100, 100]}
								isChecked={includeNFT === 'Yes'}
								onChange={() => setIncludeNFT('Yes')}
							>
								Yes
							</Checkbox>
							<Checkbox
								width={[100, 100]}
								isChecked={includeNFT === 'No'}
								onChange={() => setIncludeNFT('No')}
							>
								No
							</Checkbox>
						</Center>
					</Box>
					<Flex justifyContent="flex-end">
						<Button width={[200, 250]} m={5} disabled={includeNFT === null}>
							Sign and Pay
						</Button>
					</Flex>
				</CompletionSteps>
			);
		};

		return (
			<>
				{showStep === 'requirements' && <Requirements />}
				{showStep === 'acknowledge-and-pay' && <StandardAcknowledgement />}
			</>
		);
	};

	const ButtonChoices = () => {
		const handleOnClick = (section: RegistrationSection) => {
			setShowSection(section);
		};

		return (
			<Box mt={20} mb={10}>
				<Heading size="lg" letterSpacing="0.1em" textAlign="center">
					Registration Options
				</Heading>
				<Heading
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
							disabled={showSection === 'standard'}
							onClick={() => handleOnClick('standard')}
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
				<Center p={10} gap={5}>
					{isConnected ? (
						<>
							{showSection === 'standard' && <StandardRegistration />}
							{showSection === 'selfRelay' && <SelfRelayRegistration />}
							{showSection === 'p2pRelay' && <WebRtcDirectRelay />}
						</>
					) : (
						<div>Please Connect to your wallet</div>
					)}
				</Center>
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
			<DappLayout>{isMounted && <ButtonChoices />}</DappLayout>
		</LightMode>
	);
};

export default Dapp;
