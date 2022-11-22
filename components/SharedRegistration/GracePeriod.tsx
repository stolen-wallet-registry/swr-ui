import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { Timer } from '@components/Timer';
import { Signer } from 'ethers';

interface GracePeriodInterface {
	signer: Signer;
	setExpiryStep: () => void;
	address: string;
}

const GracePeriod: React.FC<GracePeriodInterface> = ({ setExpiryStep, address, signer }) => {
	const { startBlock } = useRegBlocksLeft(address, signer);

	return (
		<RegistrationSection title="Grace Period">
			{startBlock && <Timer expiryBlock={startBlock} setExpiryStep={setExpiryStep} />}
			<Flex flexDirection="column" justifyContent="center" gap={5}>
				<Text mr={20}>Please wait for the Grace Period to complete</Text>
				<Text mr={20}>Then you can Pay to Register your wallet as Stolen</Text>
			</Flex>
		</RegistrationSection>
	);
};

export default GracePeriod;
