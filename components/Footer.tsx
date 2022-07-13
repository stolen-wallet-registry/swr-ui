import { Flex, FlexProps, Link } from '@chakra-ui/react';
import React from 'react';

const Footer = (props: FlexProps) => {
	return (
		<Flex {...props} gap={10} justifyContent="space-around" fontWeight="bold">
			<Link ml={10} href="#">
				About
			</Link>
			<Link ml={10} href="#">
				Report a bug
			</Link>
			<Link ml={10} href="#">
				Analytics
			</Link>
			<Link ml={10} href="#">
				Docs
			</Link>
			<Link ml={10} href="#">
				Twitter
			</Link>
			<Link ml={10} href="#">
				Etherscan
			</Link>
		</Flex>
	);
};

export default Footer;
