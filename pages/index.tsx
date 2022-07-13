import Layout from '../components/Layout';

import type { NextPage } from 'next';
import { Center, SimpleGrid, Divider, Heading, Box } from '@chakra-ui/react';
import Faq from '../components/Faq';
import Hero from '../components/Hero';
import WalletStats from '../components/WalletStats';
import Features from '../components/Features';

const Home: NextPage = () => {
	return (
		<Layout isDapp={false}>
			<Center backgroundColor="gray.200" minHeight="70vh">
				<WalletStats title="Stollen Wallet Stats" />
				<Hero />
			</Center>
			<Features />
			<Center>
				<Faq width={[400, 600, 800]} />
			</Center>
		</Layout>
	);
};

export default Home;
