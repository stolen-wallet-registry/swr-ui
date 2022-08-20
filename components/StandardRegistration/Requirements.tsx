import { OrderedList, ListItem, Highlight, Button, Box, Text } from '@chakra-ui/react';
import React from 'react';

import RegistrationSection from '@components/RegistrationSection';
import { HIGHLIGHT_STYLE } from '@utils/helpers';

import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { useAccount } from 'wagmi';

interface RequirementProps extends RegistrationStateManagemenetProps {}

const Requirements: React.FC<RequirementProps> = ({ setShowStep }) => {
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

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

export default Requirements;
