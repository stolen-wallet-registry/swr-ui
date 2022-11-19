import React from 'react';

import DappLayout from '../components/DappLayout';
import pick from 'lodash/pick';

import type { GetStaticProps } from 'next';
import { LightMode, useColorMode, Flex, Text, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { PreviewMessageKey, RegistrationTypes } from '@utils/types';
import useLocalStorage from '@hooks/useLocalStorage';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import Requirements from '@components/SharedRegistration/Requirements';
import ButtonChoices from '@components/ButtonChoices';
import RegistrationSection from '@components/RegistrationSection';

interface DappProps {
	messages: IntlMessages;
	previewMessages: Record<PreviewMessageKey, IntlMessages>;
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const namespaces = ['Preview'];
	const defaultLanguage = (await import(`../messages/dapp/${locale}.json`)).default;
	return {
		props: {
			// importing
			messages: defaultLanguage,
			previewMessages: {
				default: pick(defaultLanguage, namespaces),
				en: pick((await import(`../messages/dapp/en.json`)).default, namespaces),
				es: pick((await import(`../messages/dapp/es.json`)).default, namespaces),
				fr: pick((await import(`../messages/dapp/fr.json`)).default, namespaces),
			},
		},
	};
};

const Dapp: React.FC<DappProps> = ({ previewMessages, messages }) => {
	const { setColorMode } = useColorMode();
	const [isMounted, setIsMounted] = useState(false);
	const [localState] = useLocalStorage();
	const [registration, setRegistration] = useState<RegistrationTypes>(localState.registrationType);

	const { address, isConnected } = useAccount();

	useEffect(() => {
		setColorMode('light');
		setRegistration(localState.registrationType);
		setIsMounted(true);
	}, []);

	// acknowledge-and-pay
	const RequirementsDisplay = () => {
		if (!isMounted) {
			return null;
		}

		return (
			<Flex mt={20} mb={10} p={10} flexDirection="column">
				{isConnected ? (
					<>
						<ButtonChoices
							disableAll={false}
							setRegistration={setRegistration}
							registration={registration}
						/>
						<Flex flexDirection={{ lg: 'row', md: 'column', sm: 'column' }} gap={10}>
							<CompletionSteps />
							<Requirements
								address={address as string}
								isConnected={isConnected}
								registrationType={registration}
							/>
						</Flex>
					</>
				) : (
					<Center>
						<RegistrationSection title="Please connect to your wallet">
							<figure>
								<blockquote cite="https://en.wikipedia.org/wiki/Marcus_Aurelius">
									<Text>
										“Not to feel exasperated, or defeated, or despondent because your days aren’t
										packed with wise and moral actions. But to get back up when you fail, to
										celebrate behaving like a human—however imperfectly—and fully embrace the
										pursuit that you’ve embarked on.”
									</Text>
								</blockquote>
								<br />
								<figcaption>
									<Text style={{ fontWeight: 'bold' }} textAlign="end">
										Marcus Aurelius, <cite>Meditations - Book V, Passage 9</cite>
									</Text>
								</figcaption>
							</figure>
						</RegistrationSection>
					</Center>
				)}
			</Flex>
		);
	};

	return (
		<LightMode>
			<style jsx global>{`
				body {
					background-color: var(--chakra-colors-white-400) !important;
					transition-property: background-color;
					transition-duration: unset;
				}
			`}</style>
			<DappLayout showButton={false}>{isMounted && <RequirementsDisplay />}</DappLayout>
		</LightMode>
	);
};

export default Dapp;
