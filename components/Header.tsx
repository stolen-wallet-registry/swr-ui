import { Box, Button, Flex, FlexProps, Icon, Link, useColorMode } from '@chakra-ui/react';
import { Image } from './NextChalkraImage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

const Nav = () => {
	const router = useRouter();
	const { address, isConnected } = useAccount();
	const { colorMode, toggleColorMode } = useColorMode();

	const handleClick = (e) => {
		e.preventDefault();
		router.push('/dapp');
	};

	return (
		<Flex gap={5} mr={5} border="1 solid black">
			{isConnected ? (
				<>
					<ConnectButton />
					<Button onClick={toggleColorMode}>
						{colorMode === 'light' ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
					</Button>
				</>
			) : (
				<Button
					px={8}
					size="lg"
					rounded="lg"
					colorScheme="blackAlpha"
					boxShadow="2xl"
					_hover={{ transform: 'scale(1.1)' }}
					_active={{ transform: 'translateY(-2px)' }}
					onClick={handleClick}
				>
					Enter App
				</Button>
			)}
		</Flex>
	);
};

const Header = (props: FlexProps) => {
	return (
		<>
			<Box position="absolute" top={20} left={20}>
				<Link ml={10} href="/">
					<Image
						objectFit="cover"
						src="/logo.png"
						dimensions={[100, 100]}
						alt="Stolen Wallet Registry Logo"
						borderRadius={10}
					/>
				</Link>
			</Box>
			<Box position="absolute" top={20} right={20}>
				<Nav />
			</Box>
		</>
	);
};

export default Header;
