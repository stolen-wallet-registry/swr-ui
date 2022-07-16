import DappLayout from '../components/DappLayout';

import type { NextPage } from 'next';
import { Box, Button, LightMode, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

const Dapp: NextPage = () => {
	const { setColorMode } = useColorMode();

	useEffect(() => {
		setColorMode('light');
	}, []);

	return (
		<LightMode>
			<style jsx global>{`
				body {
					background-color: var(--chakra-colors-white-400) !important;
					transition-property: background-color;
					transition-duration: unset;
				}
			`}</style>
			<DappLayout></DappLayout>
		</LightMode>
	);
};

export default Dapp;
