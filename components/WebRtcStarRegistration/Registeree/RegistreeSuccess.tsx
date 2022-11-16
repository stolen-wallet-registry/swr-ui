import { Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React from 'react';

export const RegistreeSuccess = () => {
	const [localState, _] = useLocalStorage();

	return (
		<RegistrationSection title="Success!">
			<Text>
				You have successfully registered {localState.address} to the Stolen Wallet Registry.
			</Text>
		</RegistrationSection>
	);
};
