import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';

export const RegistreeSuccess = () => {
	const [localState, _] = useLocalStorage();

	// TODO: add order view to page -- if bought nft, display nfts.
	return (
		<RegistrationSection title="Success!">
			<Text mb={5}>
				Your peer, {localState.connectToPeer} has successfully settled the transaction!
			</Text>
			<Text>
				You have successfully registered {localState.address} to the Stolen Wallet Registry.
			</Text>
		</RegistrationSection>
	);
};
