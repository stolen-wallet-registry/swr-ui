import React from 'react';

import DappLayout from '../components/DappLayout';
import StolenWalletSVG from '../assets/stolen-wallet.svg';
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
	Highlight,
	OrderedList,
	ListItem,
	Checkbox,
	Text,
	CheckboxGroup,
	Spacer,
	useDisclosure,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Container,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
	useAccount,
	useContract,
	useEnsName,
	useProvider,
	useSigner,
	useNetwork,
	useContractReads,
} from 'wagmi';
import SoulBound from '../components/NftDisplay/SoulBound';
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

import {
	RegistrationTypes,
	StandardSteps,
	SelfRelaySteps,
	P2PRelaySteps,
	PreviewMessageKey,
} from '@utils/types';
import SelfRelayRegistration from '@components/SelfRelayRegistration';
import WebRtcDirectRelay from '@components/WebRtcDirectRegistration';
import {
	LANGUAGE_MAP,
	LanguageAttributes,
	LANGUAGE_OPTIONS,
	LANGUAGE_DISPLAY,
} from '@components/NftDisplay/languageData';

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
	const [showSection, setShowSection] = useState<RegistrationTypes>('standard');
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

	const PreviewModal = () => {
		const windowLang = (typeof window !== 'undefined' && window.navigator.language) || 'en-US';
		const [languageKey, setLanguageKey] = useState<string>(windowLang);
		const [selectedLanguage, setSelectedLanguage] = useState<LanguageAttributes>(
			LANGUAGE_MAP[languageKey]
		);
		const [demoAllClicked, setDemoAllClicked] = useState(false);

		const handleLanguageChange = ({ event }: { event: any }) => {
			const lang = event?.currentTarget?.value;

			if (process.env.NDOE_ENVIRONMENT === 'development') {
				console.info({ lang });
			}

			setLanguageKey(lang);
		};

		const onLangChange = () => {
			if (typeof window === 'undefined') {
				return;
			}

			setDemoAllClicked(true);
		};

		useEffect(() => {
			const lang = LANGUAGE_MAP[languageKey];
			setSelectedLanguage(lang);
		}, [languageKey]);

		if (process.env.NDOE_ENVIRONMENT === 'development') {
			console.info({ selectedLanguage, navigator: window.navigator });
		}

		return (
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent minWidth={1000}>
					<ModalHeader pt={3}>
						<Container textAlign="center" pb={3}>
							<Heading as="h2" pb={3}>
								Preview of NFTs
							</Heading>
							<Text fontSize="14px" overflowWrap="break-word">
								The SVGs served from these NFTs will detect a viewers screen reader and display the
								content in their preferred language.
							</Text>
						</Container>
						<Flex flexDirection="row" justifyContent="center">
							<Select
								colorScheme="blackAlpha"
								variant="filled"
								fontWeight="bolder"
								width="fit-content"
								onChange={(event) => handleLanguageChange({ event })}
								placeholder="Select Language"
								value={languageKey}
							>
								{LANGUAGE_DISPLAY.map((lang, i) => {
									return (
										<option key={`${lang[0]}-${i}`} value={lang[0]}>
											{lang[1]}
										</option>
									);
								})}
							</Select>
							<Button ml={5} textAlign="center" onClick={onLangChange}>
								Demo Random Languages
							</Button>
						</Flex>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex p={5} justifyContent="space-around">
							<Box>
								<Heading as="h1" mb={10} textAlign="center">
									Support NFT
								</Heading>
								<Center>
									<SoulBound
										selectedLanguage={selectedLanguage}
										demoAllClicked={demoAllClicked}
										setDemoAllClicked={setDemoAllClicked}
										setSelectedLanguage={setSelectedLanguage}
									/>
								</Center>
								<OrderedList mt={10} spacing={2} fontWeight="bold">
									<ListItem>All funds go to public goods</ListItem>
									<ListItem>Advertise your support of the SWR</ListItem>
								</OrderedList>
							</Box>
							<Box>
								<Heading as="h1" mb={10} textAlign="center">
									Wallet NFT
								</Heading>
								<Center>
									<SoulBound
										selectedLanguage={selectedLanguage}
										demoAllClicked={demoAllClicked}
										setDemoAllClicked={setDemoAllClicked}
										setSelectedLanguage={setSelectedLanguage}
									/>
								</Center>
								<OrderedList mt={10} spacing={2} fontWeight="bold">
									<ListItem>All funds go to public goods</ListItem>
									<ListItem>non-burnable, non-tradeable</ListItem>
								</OrderedList>
							</Box>
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	};

	// acknowledge-and-pay
	const ButtonChoices = () => {
		const handleOnClick = (section: RegistrationTypes) => {
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
							{showSection === 'standard' && <StandardRegistration onOpen={onOpen} />}
							{showSection === 'selfRelay' && <SelfRelayRegistration onOpen={onOpen} />}
							{showSection === 'p2pRelay' && <WebRtcDirectRelay onOpen={onOpen} />}
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
			<PreviewModal />
		</LightMode>
	);
};

export default Dapp;
