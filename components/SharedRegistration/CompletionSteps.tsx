import { OrderedList, ListItem } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';

interface StepProps {
	keyIndex: number | string;
}

interface CompletionStepsProps {
	payWallet?: string;
	peerId?: number;
}

const CompletionSteps: React.FC<CompletionStepsProps> = ({ payWallet, peerId }) => {
	const [localState, _] = useLocalStorage();
	const NftStep = ({ keyIndex }: StepProps) => (
		<ListItem key={keyIndex}>Select value for the optional NFTs.</ListItem>
	);
	const AcknowledgeStep = ({ keyIndex }: StepProps) => (
		<ListItem key={keyIndex}>
			Sign and pay an "Acknowledgement of Registration" transaction.
		</ListItem>
	);
	const WaitStep = ({ keyIndex }: StepProps) => (
		<ListItem key={keyIndex}>
			Wait 2-4 minutes grace period before you are allowed to register.
		</ListItem>
	);

	const RegistrationStep = ({ keyIndex }: StepProps) => (
		<>
			<ListItem key={keyIndex}>
				Sign {localState.registrationType === 'standard' && 'and pay'} for your wallet to be added
				to the Registry.
			</ListItem>
		</>
	);

	const StandardCompletionSteps = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<NftStep keyIndex={1} />
				<ListItem key={2}>Sign and pay an "Acknowledgement of Registration" transaction.</ListItem>
				<WaitStep keyIndex={3} />
				<RegistrationStep keyIndex={4} />
			</OrderedList>
		);
	};

	const SelfRelayCompletionSteps = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<NftStep keyIndex={1} />
				<ListItem key={2}>Sign an "Acknowledgement of Registration" transaction.</ListItem>
				<ListItem key={3}>Switch to {payWallet}</ListItem>
				<WaitStep keyIndex={4} />
				<RegistrationStep keyIndex={5} />
				<ListItem key={6}>Switch to {payWallet}</ListItem>
				<ListItem key={7}>Pay for your wallet to be added to the Registry</ListItem>
			</OrderedList>
		);
	};

	const PeerToPeerRelayCompletionSteps = () => {
		return (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<NftStep keyIndex={1} />
				<ListItem key={2}>Sign an "Acknowledgement of Registration" transaction.</ListItem>
				<ListItem key={3}>Switch to {payWallet}</ListItem>
				<WaitStep keyIndex={4} />
				<RegistrationStep keyIndex={5} />
				<ListItem key={6}>Give peer your peerId of {peerId} in order to connect</ListItem>
				<ListItem key={7}>Pay for your wallet to be added to the Registry</ListItem>
			</OrderedList>
		);
	};

	return (
		<RegistrationSection title="Completion Steps">
			{localState.registrationType === 'standard' && <StandardCompletionSteps />}
			{localState.registrationType === 'selfRelay' && <SelfRelayCompletionSteps />}
			{localState.registrationType === 'p2pRelay' && <PeerToPeerRelayCompletionSteps />}
		</RegistrationSection>
	);
};

export default CompletionSteps;
