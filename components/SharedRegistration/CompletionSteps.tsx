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
	const WaitStep = ({ keyIndex }: StepProps) => (
		<ListItem key={keyIndex}>
			Wait 2-4 minutes grace period before you are allowed to register.
		</ListItem>
	);

	const RegistrationStep = ({ keyIndex }: StepProps) => (
		<>
			<ListItem key={keyIndex}>
				Sign {localState.registrationType === 'standardRelay' && 'and pay'} for your wallet to be
				added to the Registry.
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

	const P2PRelayerCompletionSteps = () => {
		return localState.isRegistering ? (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<ListItem key={1}>
					connect to a peerusing your friends peerID and connection information.
				</ListItem>
				<ListItem key={2}>Sign an "Acknowledgement of Registration" message.</ListItem>
				<ListItem key={3}>Wait for the connected peer to pay for your Acknowledgement.</ListItem>
				<WaitStep keyIndex={4} />
				<RegistrationStep keyIndex={5} />
				<ListItem key={6}>
					Wait for the connected peer to pay for you to be added to the registry.
				</ListItem>
			</OrderedList>
		) : (
			<OrderedList ml={10} mt={2} spacing={2} fontWeight="bold">
				<ListItem key={1}>
					Give peer your peerId of {peerId} so your friend can connect to you.
				</ListItem>
				<ListItem key={2}>
					Wait for the connected peer to pass you their signed Acknowledgement of Registration
					message.
				</ListItem>
				<ListItem key={3}>Pay for the connected peers Acknowledgement.</ListItem>
				<WaitStep keyIndex={4} />
				<ListItem key={5}>
					Wait for the connected peer to pass you their signed Registration message.
				</ListItem>
				<ListItem key={6}>
					Pay for the connected peer to be added to the Stolen Wallet registry.
				</ListItem>
			</OrderedList>
		);
	};

	const P2PRegistereeCompletionSteps = () => {};

	return (
		<RegistrationSection title="Completion Steps">
			{localState.registrationType === 'standardRelay' && <StandardCompletionSteps />}
			{localState.registrationType === 'selfRelay' && <SelfRelayCompletionSteps />}
			{localState.registrationType === 'p2pRelay' && <P2PRelayerCompletionSteps />}
		</RegistrationSection>
	);
};

export default CompletionSteps;
