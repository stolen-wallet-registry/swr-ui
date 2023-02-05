import { Center, Button, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import RegistrationSection from './RegistrationSection';

const ConnectWallet: React.FC = () => {
	return (
		<Center>
			<RegistrationSection title="Please connect to your wallet to a supported network">
				<figure>
					<blockquote cite="https://en.wikipedia.org/wiki/Marcus_Aurelius">
						<Text>
							“Not to feel exasperated, or defeated, or despondent because your days aren’t packed
							with wise and moral actions. But to get back up when you fail, to celebrate behaving
							like a human—however imperfectly—and fully embrace the pursuit that you’ve embarked
							on.”
						</Text>
					</blockquote>
					<br />
					<figcaption>
						<Text style={{ fontWeight: 'bold' }} textAlign="end" mb={5}>
							Marcus Aurelius, <cite>Meditations - Book V, Passage 9</cite>
						</Text>
						<ConnectButton.Custom>
							{({ openChainModal }) => {
								return (
									<Center>
										<Button
											variant="solid"
											width="50%"
											background="black"
											color="whiteAlpha.900"
											borderColor="whiteAlpha.900"
											_hover={{ bgColor: 'red.400' }}
											_active={{ transform: 'scale(1.1)' }}
											onClick={openChainModal}
										>
											Switch Chains
										</Button>
									</Center>
								);
							}}
						</ConnectButton.Custom>
					</figcaption>
				</figure>
			</RegistrationSection>
		</Center>
	);
};

export default ConnectWallet;
