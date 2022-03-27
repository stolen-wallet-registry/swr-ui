import Layout from '../components/Layout';

import type { NextPage } from 'next';
import { Center } from '@chakra-ui/react';

const Home: NextPage = () => {
	return (
		<Layout>
			<Center minHeight="75vh">Welcome to you app.</Center>
		</Layout>
	);
};

export default Home;
