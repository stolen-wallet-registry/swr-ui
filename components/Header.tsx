import { Box, Button, Flex, Icon, Link, Text, useColorMode } from '@chakra-ui/react';
import { Image } from './NextChalkraImage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

export const DappHeader = () => {
	const { address, isConnected } = useAccount();
	const router = useRouter();

	const handleClick = () => {
		router.push('/');
	};

	return (
		<Flex gap={5} p={5} mr={5} alignItems="center" justifyContent="space-between">
			<Button as={Link} variant="link" onClick={handleClick}>
				<Image
					borderRadius={10}
					background="blackAlpha.700"
					objectFit="cover"
					src="/logo_transparent.png"
					dimensions={[55, 55]}
					alt="Stolen Wallet Registry Logo"
				/>
			</Button>
			<ConnectButton />
		</Flex>
	);
};

export const HomeHeader = () => {
	const router = useRouter();
	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push('/dapp');
	};

	return (
		<>
			<Box position="absolute" top={[10, 12, 15, 20]} left={[10, 12, 15, 20]}>
				<Link ml={10} href="/" borderRadius={10}>
					<Image
						objectFit="cover"
						src="/logo_transparent.png"
						dimensions={[100, 100]}
						alt="Stolen Wallet Registry Logo"
					/>
				</Link>
			</Box>
			<Box position="absolute" top={[10, 12, 15, 20]} right={[10, 12, 15, 20]}>
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
			</Box>
		</>
	);
};
