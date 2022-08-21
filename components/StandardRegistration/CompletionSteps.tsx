import { OrderedList, ListItem } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';

const CompletionSteps: React.FC = () => {
	return (
		<RegistrationSection title="Completion Steps">
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<ListItem key={1}>Select value for the optional NFT.</ListItem>
				<ListItem key={2}>Sign and pay an "Acknowledgement of Registration" transaction.</ListItem>
				<ListItem key={3}>
					Wait 2-4 minutes grace period before you are allowed to register.
				</ListItem>
				<ListItem key={4}>Sign and pay for your wallet to be added to the Registry.</ListItem>
			</OrderedList>
		</RegistrationSection>
	);
};

export default CompletionSteps;
