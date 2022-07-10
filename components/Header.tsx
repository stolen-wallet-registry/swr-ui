import { Button, Flex, FlexProps, Link, useColorMode } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const Nav = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Flex gap={10} mr={10} border="1 solid black">
			<Link href="#">First Link</Link>
			<Link href="#">Second Link</Link>
			<Button onClick={toggleColorMode}>Toggle {colorMode === 'light' ? 'dark' : 'light'}</Button>
			<ConnectButton />
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
