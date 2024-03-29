import { OrderedList, ListItem, Highlight, Button, Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import RegistrationSection from '@components/RegistrationSection';
import { HIGHLIGHT_STYLE, nativeTokenList } from '@utils/helpers';

import { useNetwork } from 'wagmi';

import capitalize from 'lodash/capitalize';
import useLocalStorage from '@hooks/useLocalStorage';
import {
	RegistrationValues,
	StandardSteps,
	SelfRelaySteps,
	RegistrationTypes,
	registrationTitles,
} from '@utils/types';
import router from 'next/router';
import WebRTCStarInstructions from '@components/WebRtcRegistration/WebRTCStarInstructions';
import Loader from '@components/Loader';

interface RequirementProps {
	address: string;
	isConnected: boolean;
	registrationType: RegistrationTypes;
}

const Requirements: React.FC<RequirementProps> = ({ address, isConnected, registrationType }) => {
	const [localState, setLocalState] = useLocalStorage();
	const { chain } = useNetwork();
	const [loading, setLoading] = useState(false);
	const minPayment = '0.01';

	const nativeToken = nativeTokenList?.[`0x${chain?.id?.toString(16)}`] || 'Native Token';

	const handleBegin = (step: RegistrationValues) => {
		setLoading(true);
		setLocalState({ step: step });
		router.push(`/dapp/${localState?.registrationType}`, undefined, { shallow: true });
	};

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
		<ListItem>You're connected to one of the supported chains.</ListItem>
	);

	const StandardRequirements = () => {
		useEffect(() => {
			setLoading(false);
		});
		return (
			<>
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
						>{`You have ${minPayment} ${nativeToken} that will go to the (Protocol Guild|Retro PG).`}</Highlight>
					</ListItem>
				</OrderedList>
				<Button
					isLoading={loading}
					alignSelf="flex-end"
					width={[200, 250]}
					m={5}
					onClick={() => handleBegin(StandardSteps.AcknowledgeAndPay)}
				>
					Begin
				</Button>
			</>
		);
	};

	const SelfRelayRequirements = () => {
		useEffect(() => {
			setLoading(false);
		});
		return (
			<>
				<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
					<ConnectedStep />
					<SupportedChainStep />
					<ListItem>
						<Highlight
							key={minPayment}
							query={[`${minPayment}(Eth|NativeToken)`, 'same supported chain', 'another wallet']}
							styles={HIGHLIGHT_STYLE}
						>
							{`You have another wallet with ${minPayment} ${nativeToken} on it on the same supported chain.`}
						</Highlight>
					</ListItem>
				</OrderedList>
				<Button
					alignSelf="flex-end"
					width={[200, 250]}
					m={5}
					onClick={() => handleBegin(SelfRelaySteps.AcknowledgeAndSign)}
				>
					Begin
				</Button>
			</>
		);
	};

	return (
		<RegistrationSection title={`${registrationTitles[registrationType]} Registration`}>
			<Box pb={10}>Requirements:</Box>
			{registrationType === 'standardRelay' && <StandardRequirements />}
			{registrationType === 'selfRelay' && <SelfRelayRequirements />}
			{registrationType === 'p2pRelay' && <WebRTCStarInstructions />}
		</RegistrationSection>
	);
};

export default Requirements;
