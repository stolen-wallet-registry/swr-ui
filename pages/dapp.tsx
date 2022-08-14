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
	CheckboxGroup,
	Spacer,
	useDisclosure,
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
import NftDisplayModal from '@components/SWRModal';
import SWRModal from '@components/SWRModal';

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
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { setColorMode } = useColorMode();
	const [showSection, setShowSection] = useState<RegistrationSection>('standard');
	const [modalTitle, setModalTitle] = useState('');
	const [isMounted, setIsMounted] = useState(false);
	const [signer, setSigner] = useState<ethers.Signer>();

	const provider = useProvider();
	const { chain } = useNetwork();

	const minPayment = '0.01';

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

	const ensData = useEnsName({
		address,
		chainId: 1,
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

	const RegistrationSection: React.FC<RegistrationSectionProps> = (props) => {
		return (
			<Flex
				{...props}
				width="50%"
				borderRadius={10}
				p={5}
				boxShadow="base"
				flexDirection="column"
				border="2px solid RGBA(0, 0, 0, 0.50)"
			>
				<Heading size="md" pb={5} pt={5}>
					{props.title}
				</Heading>
				{props.children}
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
		const [includeWalletNFT, setIncludeWalletNFT] = useState<boolean>();
		const [includeSupportNFT, setIncludeSupportNFT] = useState<boolean>();
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

		const CompletionSteps: React.FC = () => {
			return (
				<RegistrationSection title="Completion Steps">
					<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
						<ListItem key={1}>Select value for the optional NFT.</ListItem>
						<ListItem key={2}>
							Sign and pay an "Acknowledgement of Registration" transaction.
						</ListItem>
						<ListItem key={3}>
							Wait 2-4 minutes grace period before you are allowed to register.
						</ListItem>
						<ListItem key={4}>Sign and pay for your wallet to be added to the Registry.</ListItem>
					</OrderedList>
				</RegistrationSection>
			);
		};

		const StandardAcknowledgement = () => {
			const [acknowledgement, setAcknowledgment] = useState<signTypedDataProps>();
			const { data, isError, isLoading } = useContractReads({
				contracts: [
					{
						addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
						contractInterface: StolenWalletRegistryAbi,
						functionName: 'generateHashStruct',
						args: [address],
					},
					{
						addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
						contractInterface: StolenWalletRegistryAbi,
						functionName: 'nonces',
						args: [address],
					},
					{
						addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
						contractInterface: StolenWalletRegistryAbi,
						functionName: 'ACKNOWLEDGEMENT_TYPEHASH',
					},
					{
						addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
						contractInterface: StolenWalletRegistryAbi,
						functionName: 'REGISTRATION_TYPEHASH',
					},
				],
			});

			useEffect(() => {
				console.log(isError, isLoading, data);
				const buildStruct = async () => {
					// const stollenWalletRegistry = await StolenWalletRegistryFactory.connect(
					// 	CONTRACT_ADDRESSES.local.StolenWalletRegistry,
					// 	signer || provider
					// );

					// const contract = useContract({
					// 	addressOrName: CONTRACT_ADDRESSES.local.StolenWalletRegistry,
					// 	contractInterface: StolenWalletRegistryAbi,
					// 	signerOrProvider: signer,
					// });
					console.log(data);
					const owner = ensData.data || address;
					const { deadline, hashStruct } = await contract.generateHashStruct(address!);
					// debugger;
					// const { deadline, hashStruct } = await hshStructTx.wait();

					const nonce = await contract.nonces(address!);

					// const nonce = await noncesTx.wait();

					console.log(owner, nonce, deadline, hashStruct, owner);
					const struct = await buildAcknowledgementStruct({
						forwarder: address!,
						chainId: Number(chain?.id),
						nonces: nonce.toNumber(),
						deadline,
						owner: owner as string,
					});

					setAcknowledgment(struct);
					debugger;
				};
				if (isConnected && isMounted) {
					buildStruct();
				}
			}, [isConnected, address]);

			console.log(acknowledgement);

			return (
				<RegistrationSection title="Include NFTs?">
					<Flex>
						<Text mr={20}>
							Include{' '}
							<Text as="span" fontWeight="bold" decoration="underline">
								Supportive
							</Text>{' '}
							NFT?
						</Text>
						<Spacer />
						<CheckboxGroup>
							<Checkbox
								width={[100, 100]}
								isChecked={includeWalletNFT}
								onChange={() => setIncludeWalletNFT(true)}
							>
								Yes
							</Checkbox>
							<Checkbox
								width={[100, 100]}
								onChange={() => setIncludeWalletNFT(false)}
								isChecked={includeWalletNFT === false}
							>
								No
							</Checkbox>
						</CheckboxGroup>
					</Flex>
					<Flex>
						<Text mr={20}>
							Include{' '}
							<Text as="span" fontWeight="bold" decoration="underline">
								Wallet
							</Text>{' '}
							NFT?
						</Text>
						<Spacer />
						<CheckboxGroup>
							<Checkbox
								width={[100, 100]}
								isChecked={includeSupportNFT}
								onChange={() => setIncludeSupportNFT(true)}
							>
								Yes
							</Checkbox>
							<Checkbox
								width={[100, 100]}
								isChecked={includeSupportNFT === false}
								onChange={() => setIncludeSupportNFT(false)}
							>
								No
							</Checkbox>
						</CheckboxGroup>
					</Flex>
					<Flex alignSelf="flex-end">
						<Button width={[200, 250]} m={5}>
							View NFT
						</Button>
						<Button
							width={[200, 250]}
							m={5}
							onClick={() => use712Signature(acknowledgement!)}
							disabled={
								includeWalletNFT === undefined &&
								includeSupportNFT === undefined &&
								acknowledgement === undefined
							}
						>
							Sign and Pay
						</Button>
					</Flex>
				</RegistrationSection>
			);
		};

		return (
			<>
				{/* {showStep === 'requirements' && <Requirements />} */}
				{showStep === 'requirements' && (
					<>
						<CompletionSteps />
						<StandardAcknowledgement />
					</>
				)}
			</>
		);
	};

	// acknowledge-and-pay

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
			<SWRModal title={modalTitle} isOpen={isOpen} onOpen={onOpen} onClose={onClose}></SWRModal>
		</LightMode>
	);
};

export default Dapp;
