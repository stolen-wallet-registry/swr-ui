import { Text, Flex, Link, Button, useDisclosure } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import RegistrationSection from '@components/RegistrationSection';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import WebRTCStarInstructions from '@components/WebRtcStarRegistration/WebRTCStarInstructions';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRegistereeSteps } from '@utils/types';
import NextLink from 'next/link';
import React, { useState } from 'react';

interface P2PRelayInterface {}

const P2PRelayRegistration: React.FC<P2PRelayInterface> = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [localState, setLocalState] = useLocalStorage();

	return (
		<DappLayout
			isOpen={isOpen}
			onClose={onClose}
			heading="Peer to Peer Relay"
			subHeading="sign with one wallet, have your peer pay for you."
		>
			<Flex mt={5} mb={10} p={10} gap={5}>
				<CompletionSteps />
				{localState.step === P2PRegistereeSteps.Instructions && <WebRTCStarInstructions />}
			</Flex>
		</DappLayout>
	);
};

export default P2PRelayRegistration;
