import { Flex, FlexProps, Link } from '@chakra-ui/react';
import React from 'react';

const Nav = () => {
	return (
		<Flex gap={10} mr={10} border="1 solid black">
			<Link href="#">First Link</Link>
			<Link href="#">Second Link</Link>
		</Flex>
	);
};

const Header = (props: FlexProps) => {
	return (
		<Flex justifyContent="space-between" alignItems="center" border="1 solid black" {...props}>
			<Link ml={10} href="#">
				Logo
			</Link>
			<Nav />
		</Flex>
	);
};

export default Header;
