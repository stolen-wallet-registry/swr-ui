import { Flex, FlexProps, Text } from '@chakra-ui/react';
import React from 'react';

const Footer = (props: FlexProps) => {
	return (
		<Flex {...props} gap={10} justifyContent="space-around">
			<Text>Test One</Text>
			<Text>Test Two</Text>
		</Flex>
	);
};

export default Footer;
