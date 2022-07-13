import { Button, Flex, FlexProps, Icon, Link, useColorMode, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Nav = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Flex gap={5} mr={10} border="1 solid black">
			<Link href="#">First Link</Link>
			<Link href="#">Second Link</Link>
			<ConnectButton />
			<Button onClick={toggleColorMode}>
				{colorMode === 'light' ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
			</Button>
		</Flex>
	);
};

const Header = (props: FlexProps) => {
	return (
		<Flex justifyContent="space-between" alignItems="center" border="1 solid black" {...props}>
			<Link ml={10} href="#">
				<Image
					boxSize="100px"
					objectFit="cover"
					src="../assets/logo.png"
					alt="Stolen Wallet Registry Logo"
				/>
			</Link>
			<Nav />
		</Flex>
	);
};

export default Header;
