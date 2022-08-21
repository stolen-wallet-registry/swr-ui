import { OrderedList, ListItem, Highlight, Button, Box, Text } from '@chakra-ui/react';
import React from 'react';

import RegistrationSection from '@components/RegistrationSection';
import { HIGHLIGHT_STYLE } from '@utils/helpers';

import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { useAccount } from 'wagmi';
import { RegistrationTypes } from '@utils/types';
import capitalize from 'lodash/capitalize';

interface RequirementProps extends RegistrationStateManagemenetProps {
	address: string;
	isConnected: boolean;
	registrationType: RegistrationTypes;
}

const Requirements: React.FC<RequirementProps> = ({
	setShowStep,
	address,
	isConnected,
	registrationType,
}) => {
	const minPayment = '0.01';

	if (!isConnected) {
		return (
			<RegistrationSection title="Requirements">
				<Box>
					<OrderedList spacing={4}>
						<Text>Connect your wallet</Text>
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
		<RegistrationSection title={`${capitalize(registrationType)} Registration`}>
			<Box pb={10}>Requirements:</Box>
			{registrationType === 'standard' && <StandardRequirements />}
			{registrationType === 'selfRelay' && <SelfRelayRequirements />}
			{registrationType === 'p2pRelay' && <PeerToPeerRelayRequirements />}
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

export default Requirements;
