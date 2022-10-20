import React from 'react';

import DappLayout from '../components/DappLayout';
import pick from 'lodash/pick';

import type { GetStaticProps } from 'next';
import {
	Box,
	Button,
	Flex,
	Heading,
	LightMode,
	SimpleGrid,
	Center,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAccount, useContract, useProvider, useSigner, useNetwork } from 'wagmi';
import {
	buildAcknowledgementStruct,
	signTypedDataProps,
	use712Signature,
} from '../hooks/use712Signature';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import {
	StolenWalletRegistryAbi,
	StolenWalletRegistryFactory,
} from '@wallet-hygiene/swr-contracts';
import { ethers } from 'ethers';

import StandardRegistration from '@components/StandardRegistration';

import { RegistrationTypes, PreviewMessageKey } from '@utils/types';
import SelfRelayRegistration from '@components/SelfRelayRegistration';
import WebRtcDirectRelay from '@components/WebRtcDirectRegistration';
import useLocalStorage from '@hooks/useLocalStorage';
import PreviewModal from '@components/PreviewModal';

interface DappProps {
	messages: IntlMessages;
	previewMessages: Record<PreviewMessageKey, IntlMessages>;
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const namespaces = ['Preview'];
	const defaultLanguage = (await import(`../messages/dapp/${locale}.json`)).default;
	return {
		props: {
			// importing
			messages: defaultLanguage,
			previewMessages: {
				default: pick(defaultLanguage, namespaces),
				en: pick((await import(`../messages/dapp/en.json`)).default, namespaces),
				es: pick((await import(`../messages/dapp/es.json`)).default, namespaces),
				fr: pick((await import(`../messages/dapp/fr.json`)).default, namespaces),
			},
		},
	};
};

const Dapp: React.FC<DappProps> = ({ previewMessages, messages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { setColorMode } = useColorMode();
	const [isMounted, setIsMounted] = useState(false);
	const [signer, setSigner] = useState<ethers.Signer>();

	const provider = useProvider();
	const { chain } = useNetwork();

	const contract = useContract({
		addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
		contractInterface: StolenWalletRegistryAbi,
		signerOrProvider: signer || provider,
	});

	// const stollenWalletRegistry = await StolenWalletRegistryFactory.connect(
	// 	CONTRACT_ADDRESSES.local.StolenWalletRegistry,
	// 	signer || provider
	// );

	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	useSigner({
		onSuccess: (wallet) => {
			setSigner(wallet!);
			contract.connect(wallet);
		},
	});

	useEffect(() => {
		setColorMode('light');
		setIsMounted(true);
	}, []);

	// acknowledge-and-pay
	const ButtonChoices = () => {
		const [localState, setLocalState] = useLocalStorage();
		const handleOnClick = (section: RegistrationTypes) => {
			setLocalState({ registrationType: section });
		};

		console.log(localState);

		if (!isMounted) {
			return null;
		}

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
							disabled={localState?.registrationType === 'standard'}
							onClick={() => handleOnClick('standard')}
							_active={{ transform: 'translateY(-2px) scale(1.2)' }}
						>
							Standard
						</Button>
						<Button
							variant="outline"
							width={200}
							disabled={localState?.registrationType === 'selfRelay'}
							onClick={() => handleOnClick('selfRelay')}
							_active={{ transform: 'translateY(-2px) scale(1.2)' }}
						>
							Self Relay
						</Button>
						<Button
							variant="outline"
							width={200}
							disabled={localState?.registrationType === 'p2pRelay'}
							onClick={() => handleOnClick('p2pRelay')}
							_active={{ transform: 'translateY(-2px) scale(1.2)' }}
						>
							P2P Relay
						</Button>
					</SimpleGrid>
				</Flex>
				<Center p={10} gap={5}>
					{isConnected ? (
						<>
							{localState?.registrationType === 'standard' && (
								<StandardRegistration onOpen={onOpen} />
							)}
							{localState?.registrationType === 'selfRelay' && (
								<SelfRelayRegistration onOpen={onOpen} />
							)}
							{localState?.registrationType === 'p2pRelay' && <WebRtcDirectRelay onOpen={onOpen} />}
							<PreviewModal isOpen={isOpen} onClose={onClose} />
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
