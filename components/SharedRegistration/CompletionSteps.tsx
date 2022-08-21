import { OrderedList, ListItem } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { RegistrationTypes } from '@utils/types';

interface StepProps {
	key: number | string;
}

interface CompletionStepsProps {
	registrationType: RegistrationTypes;
	payWallet?: string;
	peerId?: number;
}

const CompletionSteps: React.FC<CompletionStepsProps> = ({
	registrationType,
	payWallet,
	peerId,
}) => {
	const NftStep = ({ key }: StepProps) => (
		<ListItem key={key}>Select value for the optional NFTs.</ListItem>
	);
	const AcknowledgeStep = ({ key }: StepProps) => (
		<ListItem key={key}>Sign and pay an "Acknowledgement of Registration" transaction.</ListItem>
	);
	const WaitStep = ({ key }: StepProps) => (
		<ListItem key={key}>Wait 2-4 minutes grace period before you are allowed to register.</ListItem>
	);

	const RegistrationStep = ({ key }: StepProps) => (
		<>
			<ListItem key={key}>
				Sign {registrationType === 'standard' && 'and pay'} for your wallet to be added to the
				Registry.
			</ListItem>
		</>
	);

	const StandardCompletionSteps = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<NftStep key={1} />
				<ListItem key={2}>Sign and pay an "Acknowledgement of Registration" transaction.</ListItem>
				<WaitStep key={3} />
				<RegistrationStep key={4} />
			</OrderedList>
		);
	};

	const SelfRelayCompletionSteps = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<NftStep key={1} />
				<ListItem key={2}>Sign an "Acknowledgement of Registration" transaction.</ListItem>
				<ListItem key={3}>Switch to {payWallet}</ListItem>
				<WaitStep key={4} />
				<RegistrationStep key={5} />
				<ListItem key={6}>Switch to {payWallet}</ListItem>
				<ListItem key={7}>Pay for your wallet to be added to the Registry</ListItem>
			</OrderedList>
		);
	};

	const PeerToPeerRelayCompletionSteps = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<NftStep key={1} />
				<ListItem key={2}>Sign an "Acknowledgement of Registration" transaction.</ListItem>
				<ListItem key={3}>Switch to {payWallet}</ListItem>
				<WaitStep key={4} />
				<RegistrationStep key={5} />
				<ListItem key={6}>Give peer your peerId of {peerId} in order to connect</ListItem>
				<ListItem key={7}>Pay for your wallet to be added to the Registry</ListItem>
			</OrderedList>
		);
	};

	return (
		<RegistrationSection title="Completion Steps">
			{registrationType === 'standard' && <StandardCompletionSteps />}
			{registrationType === 'selfRelay' && <SelfRelayCompletionSteps />}
			{registrationType === 'p2pRelay' && <PeerToPeerRelayCompletionSteps />}
		</RegistrationSection>
	);
};

export default CompletionSteps;
