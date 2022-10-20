import { OrderedList, ListItem, Highlight, Button, Box, Text } from '@chakra-ui/react';
import React from 'react';

import RegistrationSection from '@components/RegistrationSection';
import { HIGHLIGHT_STYLE } from '@utils/helpers';

import capitalize from 'lodash/capitalize';
import useLocalStorage from '@hooks/useLocalStorage';

interface RequirementProps {
	address: string;
	isConnected: boolean;
	handleBegin: () => void;
}

const Requirements: React.FC<RequirementProps> = ({ handleBegin, address, isConnected }) => {
	const [localState, setLocalState] = useLocalStorage();
	const minPayment = '0.01';

	console.log({ localState });

	if (!isConnected) {
		return (
			<RegistrationSection title="Requirements">
				<Box>
					<OrderedList spacing={4}>
						<Text>Connect your wallet Please</Text>
					</OrderedList>
				</Box>
			</RegistrationSection>
		);
	}

	const ConnectedStep = () => (
		<ListItem>
			<Highlight key={address} query={[`${address}`]} styles={HIGHLIGHT_STYLE}>
				{`Your connected Wallet (${address}) is compromised.`}
			</Highlight>
		</ListItem>
	);

	const SupportedChainStep = () => (
		<ListItem>Your are connected to one of the supported chains.</ListItem>
	);

	const StandardRequirements = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<ConnectedStep />
				<SupportedChainStep />
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
		);
	};

	const SelfRelayRequirements = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<ConnectedStep />
				<SupportedChainStep />
				<ListItem>
					<Highlight
						key={minPayment}
						query={[`${minPayment}(Eth|NativeToken)`, 'same supported chain', 'another wallet']}
						styles={HIGHLIGHT_STYLE}
					>
						{`You have another wallet with ${minPayment}(Eth|NativeToken) on it on the same supported chain.`}
					</Highlight>
				</ListItem>
			</OrderedList>
		);
	};
	const PeerToPeerRelayRequirements = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<ConnectedStep />
				<SupportedChainStep />
				{/* <ListItem>
					<Highlight
						key={minPayment}
						query={[
							`${minPayment}(Eth|NativeToken)`,
							'supported chains',
							'(Protocol Guild|Retro PG)',
						]}
						styles={HIGHLIGHT_STYLE}
					>{`You have ${minPayment}(Eth|NativeToken) that will go to the (Protocol Guild|Retro PG).`}</Highlight>
				</ListItem> */}
			</OrderedList>
		);
	};

	return (
		<RegistrationSection title={`${capitalize(localState.registrationType)} Registration`}>
			<Box pb={10}>Requirements:</Box>
			{localState.registrationType === 'standard' && <StandardRequirements />}
			{localState.registrationType === 'selfRelay' && <SelfRelayRequirements />}
			{localState.registrationType === 'p2pRelay' && <PeerToPeerRelayRequirements />}
			<Button alignSelf="flex-end" width={[200, 250]} m={5} onClick={handleBegin}>
				Begin
			</Button>
		</RegistrationSection>
	);
};

export default Requirements;
