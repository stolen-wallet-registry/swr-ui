import React from 'react';

import DappLayout from '../components/DappLayout';

import { LightMode, useColorMode, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import ConnectWallet from '@components/ConnectWallet';
import Choices from '@components/Choices';
import { DappProvider } from 'contexts/DappContext';

const Dapp: React.FC = () => {
	const { setColorMode } = useColorMode();
	const { address, isConnected } = useAccount();
	const [isMounted, setIsMounted] = useState(false);
	const { chain } = useNetwork();

	useEffect(() => {
		setColorMode('light');
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<DappProvider>
			<LightMode>
				<style jsx global>{`
					body {
						background-color: var(--chakra-colors-white-400) !important;
						transition-property: background-color;
						transition-duration: unset;
					}
				`}</style>
				<DappLayout showButton={false}>
					<Flex mt={20} mb={10} p={10} flexDirection="column">
						{isConnected && !chain?.unsupported ? (
							<Choices isConnected={isConnected} address={address} />
						) : (
							<ConnectWallet />
						)}
					</Flex>
				</DappLayout>
			</LightMode>
		</DappProvider>
	);
};

export default Dapp;
