import React from 'react';

import DappLayout from '../components/DappLayout';

import { LightMode, useColorMode, Flex, Text, Center, Button, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Chain, useAccount, useNetwork } from 'wagmi';

import { RegistrationTypes } from '@utils/types';
import useLocalStorage from '@hooks/useLocalStorage';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import Requirements from '@components/SharedRegistration/Requirements';
import RegistrationSection from '@components/RegistrationSection';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ButtonChoicesInterface {
	disableAll?: boolean;
	setRegistration?: (section: any) => void;
	registration?: RegistrationTypes;
}

const ButtonChoices: React.FC<ButtonChoicesInterface> = ({
	disableAll = false,
	setRegistration,
	registration,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const handleOnClick = (section: RegistrationTypes) => {
		setLocalState({ registrationType: section });
		setRegistration && setRegistration(section);
	};

	return (
		<Flex justifyContent="space-around" alignItems="center">
			<SimpleGrid spacing={20} columns={[1, 1, 3]} p={10} gap={5}>
				<Button
					variant="outline"
					width={200}
					disabled={disableAll || registration === 'standardRelay'}
					onClick={() => handleOnClick('standardRelay')}
					_active={{ transform: 'translateY(-2px) scale(1.2)' }}
				>
					Standard
				</Button>
				<Button
					variant="outline"
					width={200}
					disabled={disableAll || registration === 'selfRelay'}
					onClick={() => handleOnClick('selfRelay')}
					_active={{ transform: 'translateY(-2px) scale(1.2)' }}
				>
					Self Relay
				</Button>
				<Button
					variant="outline"
					width={200}
					disabled={disableAll || registration === 'p2pRelay'}
					onClick={() => handleOnClick('p2pRelay')}
					_active={{ transform: 'translateY(-2px) scale(1.2)' }}
				>
					P2P Relay
				</Button>
			</SimpleGrid>
		</Flex>
	);
};

const ConnectWallet: React.FC = () => {
	return (
		<Center>
			<RegistrationSection title="Please connect to your wallet to a supported network">
				<figure>
					<blockquote cite="https://en.wikipedia.org/wiki/Marcus_Aurelius">
						<Text>
							“Not to feel exasperated, or defeated, or despondent because your days aren’t packed
							with wise and moral actions. But to get back up when you fail, to celebrate behaving
							like a human—however imperfectly—and fully embrace the pursuit that you’ve embarked
							on.”
						</Text>
					</blockquote>
					<br />
					<figcaption>
						<Text style={{ fontWeight: 'bold' }} textAlign="end" mb={5}>
							Marcus Aurelius, <cite>Meditations - Book V, Passage 9</cite>
						</Text>
						<ConnectButton.Custom>
							{({ openChainModal }) => {
								return (
									<Center>
										<Button
											variant="solid"
											width="50%"
											background="black"
											color="whiteAlpha.900"
											borderColor="whiteAlpha.900"
											_hover={{ bgColor: 'red.400' }}
											_active={{ transform: 'scale(1.1)' }}
											onClick={openChainModal}
										>
											Switch Chains
										</Button>
									</Center>
								);
							}}
						</ConnectButton.Custom>
					</figcaption>
				</figure>
			</RegistrationSection>
		</Center>
	);
};

interface FeatureDisplayInterface {
	address: string;
	isConnected: boolean;
	registration: RegistrationTypes;
}

const FeatureDisplay = ({ address, isConnected, registration }: FeatureDisplayInterface) => {
	return (
		<Flex flexDirection={{ lg: 'row', md: 'column', sm: 'column' }} gap={10}>
			<CompletionSteps />
			<Requirements
				address={address as string}
				isConnected={isConnected}
				registrationType={registration}
			/>
		</Flex>
	);
};

const Dapp: React.FC = () => {
	const { setColorMode } = useColorMode();
	const [isMounted, setIsMounted] = useState(false);
	const [localState, setLocalState] = useLocalStorage();
	const [registration, setRegistration] = useState<RegistrationTypes>(localState.registrationType);
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();

	useEffect(() => {
		setColorMode('light');
		setRegistration(localState.registrationType);
		setIsMounted(true);
	}, []);

	// acknowledge-and-pay
	const RequirementsDisplay = () => {
		if (!isMounted) {
			return null;
		}

		return (
			<Flex mt={20} mb={10} p={10} flexDirection="column">
				{isConnected && !chain?.unsupported ? (
					<>
						<ButtonChoices
							disableAll={false}
							setRegistration={setRegistration}
							registration={registration}
						/>
						<FeatureDisplay
							address={address as string}
							isConnected={isConnected}
							registration={registration}
						/>
					</>
				) : (
					<ConnectWallet />
				)}
			</Flex>
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
			<DappLayout showButton={false}>{isMounted && <RequirementsDisplay />}</DappLayout>
		</LightMode>
	);
};

export default Dapp;
