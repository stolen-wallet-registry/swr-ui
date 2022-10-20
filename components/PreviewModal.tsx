import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	Container,
	Heading,
	Flex,
	Select,
	Button,
	ModalCloseButton,
	ModalBody,
	Center,
	OrderedList,
	ListItem,
	ModalFooter,
	Box,
	Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { LanguageAttributes, LANGUAGE_MAP, LANGUAGE_DISPLAY } from './NftDisplay/languageData';
import SoulBound from './NftDisplay/SoulBound';

interface PreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
	const windowLang = (typeof window !== 'undefined' && window.navigator.language) || 'en-US';
	const [languageKey, setLanguageKey] = useState<string>(windowLang);
	const [selectedLanguage, setSelectedLanguage] = useState<LanguageAttributes>(
		LANGUAGE_MAP[languageKey]
	);
	const [demoAllClicked, setDemoAllClicked] = useState(false);

	const handleLanguageChange = ({ event }: { event: any }) => {
		const lang = event?.currentTarget?.value;

		if (process.env.NDOE_ENVIRONMENT === 'development') {
			console.info({ lang });
		}

		setLanguageKey(lang);
	};

	const onLangChange = () => {
		if (typeof window === 'undefined') {
			return;
		}

		setDemoAllClicked(true);
	};

	useEffect(() => {
		const lang = LANGUAGE_MAP[languageKey];
		setSelectedLanguage(lang);
	}, [languageKey]);

	if (process.env.NDOE_ENVIRONMENT === 'development') {
		console.info({ selectedLanguage, navigator: window.navigator });
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent minWidth={1000}>
				<ModalHeader pt={3}>
					<Container textAlign="center" pb={3}>
						<Heading as="h2" pb={3}>
							Preview of NFTs
						</Heading>
						<Text fontSize="14px" overflowWrap="break-word">
							The SVGs served from these NFTs will detect a viewers screen reader and display the
							content in their preferred language.
						</Text>
					</Container>
					<Flex flexDirection="row" justifyContent="center">
						<Select
							colorScheme="blackAlpha"
							variant="filled"
							fontWeight="bolder"
							width="fit-content"
							onChange={(event) => handleLanguageChange({ event })}
							placeholder="Select Language"
							value={languageKey}
						>
							{LANGUAGE_DISPLAY.map((lang, i) => {
								return (
									<option key={`${lang[0]}-${i}`} value={lang[0]}>
										{lang[1]}
									</option>
								);
							})}
						</Select>
						<Button ml={5} textAlign="center" onClick={onLangChange}>
							Demo Random Languages
						</Button>
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Flex p={5} justifyContent="space-around">
						<Box>
							<Heading as="h1" mb={10} textAlign="center">
								Support NFT
							</Heading>
							<Center>
								<SoulBound
									selectedLanguage={selectedLanguage}
									demoAllClicked={demoAllClicked}
									setDemoAllClicked={setDemoAllClicked}
									setSelectedLanguage={setSelectedLanguage}
								/>
							</Center>
							<OrderedList mt={10} spacing={2} fontWeight="bold">
								<ListItem>All funds go to public goods</ListItem>
								<ListItem>Advertise your support of the SWR</ListItem>
							</OrderedList>
						</Box>
						<Box>
							<Heading as="h1" mb={10} textAlign="center">
								Wallet NFT
							</Heading>
							<Center>
								<SoulBound
									selectedLanguage={selectedLanguage}
									demoAllClicked={demoAllClicked}
									setDemoAllClicked={setDemoAllClicked}
									setSelectedLanguage={setSelectedLanguage}
								/>
							</Center>
							<OrderedList mt={10} spacing={2} fontWeight="bold">
								<ListItem>All funds go to public goods</ListItem>
								<ListItem>non-burnable, non-tradeable</ListItem>
							</OrderedList>
						</Box>
					</Flex>
				</ModalBody>
				<ModalFooter>
					<Button onClick={onClose}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default PreviewModal;
