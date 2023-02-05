import { VStack, Text, Box, Heading, UnorderedList, ListItem, ButtonProps } from '@chakra-ui/react';
import React, { useState } from 'react';
import { SectionTitle, SectionBody } from './GridSection';
import PrimaryButton from './PrimaryButton';

type FeaturesOption =
	| 'optimism'
	| 'crossChain'
	| 'metaTx'
	| 'publicGoods'
	| 'feeswtf'
	| 'supportedChains';

interface FeaturesProps {
	color: string;
}

const BUTTON_PROPS = {
	boxShadow: 'md',
	_hover: { transform: 'scale(1.1)', bgColor: 'gray.800' },
};

interface BoldProps {
	children: React.ReactNode;
}

const Bold: React.FC<BoldProps> = ({ children }) => (
	<Text as="span" fontWeight="bold">
		{children}
	</Text>
);

const LandingButton: React.FC<ButtonProps> = ({ children, ...props }) => (
	<PrimaryButton {...BUTTON_PROPS} {...props}>
		{children}
	</PrimaryButton>
);

const CrossChainContent: React.FC = () => {
	return (
		<>
			<Box pb={3}>
				<Heading size="lg" color="gray.800" textAlign="left">
					Cross Chain transactions
				</Heading>
				<Text fontSize="md" textAlign="left" fontStyle="italic">
					Connext Network facilitates trust minimized transactions across multiple blockchains.
				</Text>
			</Box>
			<Box pb={3}>
				<Heading size="sm" pb={3}>
					One on chain Registry with multi-chain support.
				</Heading>
				<UnorderedList spacing={3}>
					<ListItem>
						runs on L2s, sidechains, alt-L1s, and eth-like chains to facilitate{' '}
						<Bold>cheap fees</Bold>.
					</ListItem>
					<ListItem>
						Allows for <Bold>one on chain contract</Bold> to query stollen wallet data.
					</ListItem>
					<ListItem>
						pay any fees for registering in the <Bold>native currency</Bold> of the chain you are
						on.
					</ListItem>
					<ListItem>
						Facilitates <Bold>optimistic bridging</Bold> to ensure security of cross chain
						registrations.
					</ListItem>
				</UnorderedList>
			</Box>
		</>
	);
};

const OptimismContent: React.FC = () => {
	return (
		<>
			<Box pb={3}>
				<Heading size="lg" color="gray.800" textAlign="right">
					One Registry hosted on Optimism
				</Heading>
				<Text fontSize="md" textAlign="right" fontStyle="italic">
					One optimism contract using Cross Chain messaging to support multiple chains.
				</Text>
			</Box>
			<Box pb={5}>
				<Heading size="sm" pb={3}>
					The Registry
				</Heading>
				<UnorderedList spacing={3}>
					<ListItem>
						compatable with <Bold>ECDSA secp256k1 compliant</Bold> wallets.
					</ListItem>
					<ListItem>
						one on chain registry that is <Bold>accessible on chain via Bridge messaging</Bold>.
					</ListItem>
					<ListItem>
						support on multiple chains, <Bold>one subgraph</Bold> for all <Bold>data</Bold>.
					</ListItem>
				</UnorderedList>
			</Box>
			<Box>
				<Heading size="sm" pb={3}>
					Why Register your stolen wallet?
				</Heading>
				<UnorderedList spacing={3}>
					<ListItem>
						Your history serves as your <Bold>semi-anonymous on chain identity</Bold> - airdrops,
						whitelists, etc.
					</ListItem>
					<ListItem>
						Once an address is compromised,{' '}
						<Bold>access to any future benefit of your past is compromised</Bold>.
					</ListItem>
					<ListItem>There are too many damn stollen walets out there.</ListItem>
					<ListItem>practice good wallet hygine.</ListItem>
				</UnorderedList>
			</Box>
		</>
	);
};

const MetaTxContent: React.FC = () => {
	return (
		<>
			<Box pb={3}>
				<Heading size="lg" color="gray.800" textAlign="center">
					Meta Transactions
				</Heading>
				<Text fontSize="md" textAlign="center" fontStyle="italic">
					use metatransactions to register a wallet that had all its funds stollen.
				</Text>
			</Box>
			<Heading size="sm" pb={3}>
				Dont have funds on your stollen wallet?
				<Text>no worries!</Text>
			</Heading>
			<Box pb={3}>
				<Heading size="sm" pb={3} textDecoration="underline">
					Self Relay
				</Heading>
				<UnorderedList pb={3} spacing={3}>
					<ListItem>
						Sign for registration on your stollen wallet, Switch to an uncompromised wallet
					</ListItem>
					<ListItem>Relay your own registration, paying for any transaction fees.</ListItem>
				</UnorderedList>
			</Box>
			<Box>
				<Box pb={3}>
					<Heading size="sm" textDecoration="underline">
						Peer to Peer Relay
					</Heading>
					<Text fontStyle="italic" fontSize="sm">
						using <Bold>LibP2P</Bold>, connect to a friend through <Bold>our dapp</Bold>.
					</Text>
				</Box>
				<UnorderedList pb={3} spacing={3}>
					<ListItem>Sign for registration on your stollen wallet</ListItem>
					<ListItem>
						Allow your friend to relay your registration, paying for any transaction fees requred.
					</ListItem>
				</UnorderedList>
			</Box>
		</>
	);
};

const PublicGoodsContent: React.FC = () => {
	return (
		<>
			<Box pb={3}>
				<Heading size="lg" color="gray.800" textAlign="center">
					Public Goods are Good
				</Heading>
				<Text fontSize="md" textAlign="center" fontStyle="italic">
					All fees after transaction costs are redirected to public goods.
				</Text>
			</Box>
			<Box>
				<Heading size="sm" textDecoration="underline" pb={3}>
					register your stollen wallet on:
				</Heading>
				<UnorderedList pb={3} spacing={3}>
					<Text></Text>
					<ListItem>
						Optimism - fees get routed to <Bold>Retroactive Public Goods</Bold>.
					</ListItem>
					<ListItem>
						Other Chain - fees get routed to the <Bold>Protocol Guild</Bold>.(any other supported
						chain)
					</ListItem>
				</UnorderedList>
			</Box>
			<Box pb={3}>
				<Heading size="sm" pb={3} textDecoration="underline">
					Optimism Retroactive Public Goods Fund
				</Heading>
				<UnorderedList pb={3} spacing={3}>
					<ListItem></ListItem>
					<ListItem></ListItem>
				</UnorderedList>
			</Box>
		</>
	);
};

const FeesWtfContent: React.FC = () => {
	return (
		<>
			<Box pb={3}>
				<Heading size="lg" color="gray.800" textAlign="center">
					Fees WTF?
				</Heading>
				<Text fontSize="md" textAlign="center" fontStyle="italic">
					small $3 fee that is required, donated to public goods
				</Text>
			</Box>
			<Box>
				<Heading size="sm" textDecoration="underline" pb={3}>
					register your stollen wallet on:
				</Heading>
				<UnorderedList pb={3} spacing={3}>
					<Text></Text>
					<ListItem>
						Optimism - fees get routed to <Bold>Retroactive Public Goods</Bold>.
					</ListItem>
					<ListItem>
						Other Chain - fees get routed to the <Bold>Protocol Guild</Bold>.(any other supported
						chain)
					</ListItem>
				</UnorderedList>
			</Box>
			<Box>
				<Box pb={3}>
					<Heading size="sm" textDecoration="underline">
						Types of Fees
					</Heading>
				</Box>
				<UnorderedList pb={3} spacing={3}>
					<ListItem>
						Registration: <Bold>$3</Bold> <Bold>(required)</Bold>
					</ListItem>
					<ListItem>
						Support this project NFT: <Bold>$5</Bold>{' '}
						<Bold>(optional support this project NFT)</Bold>
					</ListItem>
					<ListItem>
						Semi Soul Bound NFT: <Bold>$5</Bold>{' '}
						<Bold>(optional non-transferrable, non-burnable NFT)</Bold>
					</ListItem>
				</UnorderedList>
			</Box>
		</>
	);
};

const SupportedChainsContent: React.FC = () => {
	return (
		<>
			<Box pb={3}>
				<Heading size="lg" color="gray.800" textAlign="center">
					Meta Transactions
				</Heading>
				<Text fontSize="md" textAlign="center" fontStyle="italic">
					use metatransactions to register a wallet that had all its funds stollen.
				</Text>
			</Box>
			<Heading size="sm" pb={3}>
				Dont have funds on your stollen wallet?
				<Text>no worries!</Text>
			</Heading>
			<Box pb={3}>
				<Heading size="sm" pb={3} textDecoration="underline">
					Self Relay
				</Heading>
				<UnorderedList pb={3} spacing={3}>
					<ListItem>
						sign on your stollen wallet for registration, Switch to an uncompromised wallet
					</ListItem>
					<ListItem>Relay your own registration, paying for any transaction fees.</ListItem>
				</UnorderedList>
			</Box>
			<Box>
				<Box pb={3}>
					<Heading size="sm" textDecoration="underline">
						Peer to Peer Relay
					</Heading>
					<Text fontStyle="italic" fontSize="sm">
						using <Bold>LibP2P</Bold>, connect to a friend through <Bold>our dapp</Bold>.
					</Text>
				</Box>
				<UnorderedList pb={3} spacing={3}>
					<ListItem>You sign your transactions for registration</ListItem>
					<ListItem>
						your friend can relay for you, paying for any transaction fees requred.
					</ListItem>
				</UnorderedList>
			</Box>
		</>
	);
};

export const FeaturesSection: React.FC<FeaturesProps> = ({ color, ...props }) => {
	const [showFeature, setShowFeature] = useState<FeaturesOption>('optimism');

	const handleOnClick = (feature: FeaturesOption) => {
		setShowFeature(feature);
	};

	return (
		<>
			<SectionTitle title="Features" selectedColor={color}>
				<VStack spacing={5}>
					<LandingButton onClick={() => handleOnClick('optimism')} bgColor={`${color}.200`}>
						Optimism
					</LandingButton>
					<LandingButton onClick={() => handleOnClick('crossChain')} bgColor={`${color}.200`}>
						Cross Chain
					</LandingButton>
					<LandingButton onClick={() => handleOnClick('metaTx')} bgColor={`${color}.200`}>
						Meta Tx
					</LandingButton>
					<LandingButton onClick={() => handleOnClick('publicGoods')} bgColor={`${color}.200`}>
						Public Goods
					</LandingButton>
					<LandingButton onClick={() => handleOnClick('feeswtf')} bgColor={`${color}.200`}>
						Fees WTF?
					</LandingButton>
					<LandingButton onClick={() => handleOnClick('supportedChains')} bgColor={`${color}.200`}>
						Supported Chains
					</LandingButton>
				</VStack>
			</SectionTitle>
			<SectionBody selectedColor={color}>
				{showFeature === 'optimism' && <OptimismContent />}
				{showFeature === 'crossChain' && <CrossChainContent />}
				{showFeature === 'metaTx' && <MetaTxContent />}
				{showFeature === 'publicGoods' && <PublicGoodsContent />}
				{showFeature === 'feeswtf' && <FeesWtfContent />}
				{showFeature === 'supportedChains' && <SupportedChainsContent />}
			</SectionBody>
		</>
	);
};
