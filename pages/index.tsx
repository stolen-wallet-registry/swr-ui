import Layout from '../components/Layout';

import type { NextPage } from 'next';
import { Button, Center, useColorMode } from '@chakra-ui/react';
import Faq from '../components/Faq';

const Home: NextPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	debugger;
	return (
		<Layout>
			<Center minHeight="75vh">
				<Faq width="800px" />
			</Center>
		</Layout>
	);
};

export default Home;
