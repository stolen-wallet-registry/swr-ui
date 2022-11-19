import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';

export const RelayerSuccess = () => {
	const [localState, _] = useLocalStorage();

	// TODO: add order view to page -- if bought nft, display nfts.
	return (
		<RegistrationSection title="Success!">
			<Text mb={5}>You have successfully completeted your job as relayer.</Text>
			<Text mb={5}>
				{localState.trustedRelayerFor!} has been added to the stolen wallet registry.
			</Text>
		</RegistrationSection>
	);
};
