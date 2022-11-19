import RegistrationSection from '@components/RegistrationSection';
import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import useLocalStorage from '@hooks/useLocalStorage';

export const SessionExpired = () => {
	const [localState, _] = useLocalStorage();

	return (
		<RegistrationSection title="Session Expired">
			<Text mb={5}>your session for registering has expired.</Text>
			<Text>
				In order to successfully register {localState.address}, click the{' '}
				<span style={{ fontWeight: 'bold' }}>Restart Session</span> button above{' '}
				{localState.registrationType === 'p2pRelay' ? 'and have your peer restart theirs.' : ''}
			</Text>
		</RegistrationSection>
	);
};
