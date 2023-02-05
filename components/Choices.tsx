import { Flex, SimpleGrid, Button, Spinner, Center } from '@chakra-ui/react';
import { RegistrationTypes, String0x } from '@utils/types';
import CompletionSteps from './SharedRegistration/CompletionSteps';
import Requirements from './SharedRegistration/Requirements';
import useLocalStorage from '@hooks/useLocalStorage';
import { useState, useEffect } from 'react';
import { useDappContext } from 'contexts/DappContext';
import Loader from './Loader';

interface ChoicesInterface {
	isConnected: boolean;
	address: String0x;
}

interface FeatureDisplayInterface {
	loading: boolean;
	address: string;
	isConnected: boolean;
	registration: RegistrationTypes;
}

const FeatureDisplay = ({
	loading,
	address,
	isConnected,
	registration,
}: FeatureDisplayInterface) => {
	if (loading) {
		return <Loader />;
	}

	return (
		<Flex
			justifyContent="center"
			flexDirection={{ lg: 'row', md: 'column', sm: 'column' }}
			gap={10}
		>
			<CompletionSteps />
			<Requirements
				address={address as string}
				isConnected={isConnected}
				registrationType={registration}
			/>
		</Flex>
	);
};

const Choices = ({ isConnected, address }: ChoicesInterface) => {
	const [localState, setLocalState] = useLocalStorage();
	const [registration, setRegistration] = useState<RegistrationTypes>(localState.registrationType);
	const [loading, setLoading] = useState(true);

	const handleOnClick = (section: RegistrationTypes) => {
		setLocalState({ registrationType: section });
		setRegistration && setRegistration(section);
	};

	useEffect(() => {
		setRegistration(localState.registrationType);
		setTimeout(() => setLoading(false), 800);
	}, []);

	return (
		<>
			<Flex justifyContent="space-around" alignItems="center">
				<SimpleGrid spacing={20} columns={[1, 1, 3]} p={10} gap={5}>
					<Button
						variant="outline"
						width={200}
						disabled={registration === 'standardRelay'}
						onClick={() => handleOnClick('standardRelay')}
						_active={{ transform: 'translateY(-2px) scale(1.2)' }}
					>
						Standard
					</Button>
					<Button
						variant="outline"
						width={200}
						disabled={registration === 'selfRelay'}
						onClick={() => handleOnClick('selfRelay')}
						_active={{ transform: 'translateY(-2px) scale(1.2)' }}
					>
						Self Relay
					</Button>
					<Button
						variant="outline"
						width={200}
						disabled={registration === 'p2pRelay'}
						onClick={() => handleOnClick('p2pRelay')}
						_active={{ transform: 'translateY(-2px) scale(1.2)' }}
					>
						P2P Relay
					</Button>
				</SimpleGrid>
			</Flex>
			<FeatureDisplay
				loading={loading}
				address={address as string}
				isConnected={isConnected}
				registration={registration}
			/>
		</>
	);
};

export default Choices;
