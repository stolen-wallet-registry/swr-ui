import DappLayout from '../components/DappLayout';

import type { NextPage } from 'next';
import { Box, Button, DarkMode, LightMode, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

const Dapp: NextPage = () => {
	const { setColorMode } = useColorMode();

	useEffect(() => {
		setColorMode('light');
	}, []);

	return (
		<LightMode>
			<DappLayout></DappLayout>
		</LightMode>
	);
};

export default Dapp;
