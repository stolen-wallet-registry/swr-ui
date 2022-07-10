import Layout from '../components/Layout';

import type { NextPage } from 'next';
import { Center } from '@chakra-ui/react';
import Faq from '../components/Faq';

const Home: NextPage = () => {
	return (
		<Layout>
			<Center minHeight="75vh">
				<Faq width="800px" />
			</Center>
		</Layout>
	);
};

export default Home;
