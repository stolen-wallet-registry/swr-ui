import { Flex } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import RegistrationSection from '@components/RegistrationSection';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import React, { useState } from 'react';

interface WebRTCStarInterface {
	onOpen: () => void;
}

const Web: React.FC<WebRTCStarInterface> = ({ onOpen }) => {
	return (
		<DappLayout
			heading="Peer to Peer Relay"
			subHeading="sign wtih one wallet, have your peers pay for you"
		>
			<Flex mt={20} mb={10} p={10} gap={5}>
				<CompletionSteps />
				<RegistrationSection title="Include NFTs?">
					<div>webrtc-star</div>
				</RegistrationSection>
			</Flex>
		</DappLayout>
	);
};

export default Web;
