import { Flex, SimpleGrid, Button } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { RegistrationTypes } from '@utils/types';
import React from 'react';

interface ButtonChoicesInterface {
	disableAll?: boolean;
	setRegistration?: (section: any) => void;
	registration?: RegistrationTypes;
}

const ButtonChoices: React.FC<ButtonChoicesInterface> = ({
	disableAll = false,
	setRegistration,
	registration,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const handleOnClick = (section: RegistrationTypes) => {
		setLocalState({ registrationType: section });
		setRegistration && setRegistration(section);
	};

	return (
		<Flex justifyContent="space-around" alignItems="center">
			<SimpleGrid spacing={20} columns={[1, 1, 3]} p={10} gap={5}>
				<Button
					variant="outline"
					width={200}
					disabled={disableAll || registration === 'standardRelay'}
					onClick={() => handleOnClick('standardRelay')}
					_active={{ transform: 'translateY(-2px) scale(1.2)' }}
				>
					Standard
				</Button>
				<Button
					variant="outline"
					width={200}
					disabled={disableAll || registration === 'selfRelay'}
					onClick={() => handleOnClick('selfRelay')}
					_active={{ transform: 'translateY(-2px) scale(1.2)' }}
				>
					Self Relay
				</Button>
				<Button
					variant="outline"
					width={200}
					disabled={disableAll || registration === 'p2pRelay'}
					onClick={() => handleOnClick('p2pRelay')}
					_active={{ transform: 'translateY(-2px) scale(1.2)' }}
				>
					P2P Relay
				</Button>
			</SimpleGrid>
		</Flex>
	);
};

export default ButtonChoices;
