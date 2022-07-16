import { Box, Button, Flex, HStack, Icon, Link, Text, useColorMode } from '@chakra-ui/react';
import { Image } from './NextChalkraImage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { FaMoon, FaSun } from 'react-icons/fa';

export const DappHeader = () => {
	const router = useRouter();
	const { colorMode, toggleColorMode } = useColorMode();

	const handleClick = () => {
		router.push('/');
	};

	return (
		<Flex gap={5} p={5} mr={5} alignItems="center" justifyContent="space-between">
			<Button variant="outline" onClick={handleClick}>
				Home
			</Button>
			{/* <ConnectButton
				showBalance={{
					smallScreen: false,
					largeScreen: true,
				}}
			/> */}
			<ConnectButton.Custom>
				{({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
					return (
						<div
							{...(!mounted && {
								'aria-hidden': true,
								style: {
									opacity: 0,
									pointerEvents: 'none',
									userSelect: 'none',
								},
							})}
						>
							{(() => {
								if (!mounted || !account || !chain) {
									return (
										<button onClick={openConnectModal} type="button">
											Connect Wallet
										</button>
									);
								}

								if (chain.unsupported) {
									return (
										<button onClick={openChainModal} type="button">
											Wrong network
										</button>
									);
								}

								return (
									<div style={{ display: 'flex', gap: 12 }}>
										<button
											onClick={openChainModal}
											style={{ display: 'flex', alignItems: 'center' }}
											type="button"
										>
											{chain.hasIcon && (
												<div
													style={{
														background: chain.iconBackground,
														width: 12,
														height: 12,
														borderRadius: 999,
														overflow: 'hidden',
														marginRight: 4,
													}}
												>
													{chain.iconUrl && (
														<img
															alt={chain.name ?? 'Chain icon'}
															src={chain.iconUrl}
															style={{ width: 12, height: 12 }}
														/>
													)}
												</div>
											)}
											{chain.name}
										</button>

										<button onClick={openAccountModal} type="button">
											{account.displayName}
											{account.displayBalance ? ` (${account.displayBalance})` : ''}
										</button>
									</div>
								);
							})()}
						</div>
					);
				}}
			</ConnectButton.Custom>
			{/* <Button onClick={toggleColorMode}>
				{colorMode === 'light' ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
			</Button> */}
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
