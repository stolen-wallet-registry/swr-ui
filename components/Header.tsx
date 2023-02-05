import { Box, Button, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { Image } from './NextChalkraImage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useRouter } from 'next/router';
import { Chain } from 'wagmi';

interface ConnectChain {
	hasIcon: boolean;
	iconUrl?: string | undefined;
	iconBackground?: string | undefined;
	id: number;
	name?: string | undefined;
	unsupported?: boolean | undefined;
}

interface Chainish {
	chain: ConnectChain;
}

const ChainDisplay: React.FC<Chainish> = ({ chain }) => {
	const ChainIcon = () => {
		return chain.hasIcon ? (
			<div
				style={{
					background: chain.iconBackground,
					width: 12,
					height: 12,
					filter: 'grayscale(100%)',
					borderRadius: 999,
					overflow: 'hidden',
					marginRight: 2,
				}}
			>
				{chain.iconUrl && (
					<Image alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} width={12} height={12} />
				)}
			</div>
		) : null;
	};

	return (
		<Flex flexDirection="column">
			<Text as="span" fontSize="xs" fontWeight="bold" mb="-5px">
				Network:
			</Text>
			<HStack>
				<ChainIcon />
				<Text>{chain.name}</Text>
			</HStack>
		</Flex>
	);
};

interface ConnectAccount {
	address: string;
	balanceDecimals?: number;
	balanceFormatted?: string;
	balanceSymbol?: string;
	displayBalance?: string;
	displayName: string;
	ensAvatar?: string;
	ensName?: string;
	hasPendingTransactions: boolean;
}

interface ConnectDisplayProps {
	mounted: boolean;
	account: ConnectAccount;
	chain: ConnectChain;
	openConnectModal: () => void;
	openChainModal: () => void;
}

const ConnectDisplay: React.FC<ConnectDisplayProps> = ({
	mounted,
	account,
	chain,
	openConnectModal,
	openChainModal,
}) => {
	if (!mounted || !account || !chain) {
		return (
			<Button variant="outline" onClick={openConnectModal}>
				Connect Wallet
			</Button>
		);
	}

	if (chain?.unsupported) {
		return (
			<Button
				variant="outline"
				color="red.400"
				borderColor="red.400"
				_hover={{ bgColor: 'red.500', color: 'whiteAlpha.900' }}
				_active={{ transform: 'scale(1.1)' }}
				onClick={openChainModal}
			>
				Wrong network
			</Button>
		);
	}

	return null;
};

export const DappHeader = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push('/');
	};

	return (
		<Flex gap={5} p={5} mr={5} alignItems="center" justifyContent="space-between">
			<Button variant="outline" onClick={handleClick}>
				Home
			</Button>
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
										<Button variant="outline" onClick={openConnectModal}>
											Connect Wallet
										</Button>
									);
								}

								if (chain.unsupported) {
									return (
										<Button
											variant="outline"
											color="red.400"
											borderColor="red.400"
											_hover={{ bgColor: 'red.500', color: 'whiteAlpha.900' }}
											_active={{ transform: 'scale(1.1)' }}
											onClick={openChainModal}
										>
											Wrong network
										</Button>
									);
								}

								return (
									<div style={{ display: 'flex', gap: 12 }}>
										<ChainDisplay chain={chain} />

										<Button
											variant="outline"
											onClick={openChainModal}
											style={{ display: 'flex', alignItems: 'center' }}
										>
											Switch Networks
										</Button>

										<Button variant="outline" onClick={openAccountModal}>
											{account.displayName}
											{account.displayBalance ? ` (${account.displayBalance})` : ''}
										</Button>
									</div>
								);
							})()}
						</div>
					);
				}}
			</ConnectButton.Custom>
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
					colorScheme="gray.800"
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
