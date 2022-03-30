import { Flex, FlexProps, Link } from '@chakra-ui/react';
import React from 'react';

const Footer = (props: FlexProps) => {
	return (
		<Flex {...props} gap={10} justifyContent="space-around">
			<Link ml={10} href="#">
				Link One
			</Link>
			<Link ml={10} href="#">
				Link Two
			</Link>
		</Flex>
	);
};

export default Footer;
