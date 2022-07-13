import React from 'react';

import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Box,
	Center,
	Heading,
	ChakraProps,
} from '@chakra-ui/react';

const Faq: React.FC<ChakraProps> = (props) => {
	return (
		<Box pb={10} px={{ base: 2, sm: 12, md: 17 }} {...props}>
			<Heading
				as="h2"
				textAlign="center"
				fontSize={'4xl'}
				py={10}
				color={'green.400'}
				fontWeight={'bold'}
			>
				FAQ
			</Heading>
			<Accordion defaultIndex={[0]} allowMultiple>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box flex="1" textAlign="left">
								Section 1 title
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box flex="1" textAlign="left">
								Section 2 title
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Box>
	);
};

export default Faq;
