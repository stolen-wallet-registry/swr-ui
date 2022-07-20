import Layout, { COLORS, ColorValues } from '../components/Layout';

import type { GetStaticProps, NextPage } from 'next';
import {
	Center,
	Heading,
	GridItem,
	Box,
	SimpleGrid,
	useColorMode,
	Button,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ColorButton from '../components/ColorButton';

import { SectionTitle, SectionBody } from '../components/GridSection';
import { FeaturesSection } from '../components/LandingSections';
import PrimaryButton from '../components/PrimaryButton';
import { AppProps } from 'next/app';

type showColorProps = 'home' | 'about' | 'why' | 'how' | 'features';

const randomNumber = () => {
	return Math.floor(Math.random() * 4);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const initialColor = COLORS[randomNumber()];
	return {
		props: { initialColor },
	};
};

interface HomeProps extends AppProps {
	initialColor: ColorValues;
}

const Home: NextPage<HomeProps> = ({ initialColor }) => {
	const [color, setColor] = useState<ColorValues>(initialColor);
	const [show, setShow] = useState<showColorProps>('home');
	const { setColorMode } = useColorMode();

	useEffect(() => {
		window.document.body.style.backgroundColor = `var(--chakra-colors-${color}-400) !important;`;
		setColorMode('light');
	}, []);

	const Hero = () => {
		const handleOnClick = (showValue: showColorProps) => {
			const colorPicks = COLORS.filter((c) => c !== color);
			const newColor = colorPicks[randomNumber()];
			window.document.body.style.backgroundColor = `var(--chakra-colors-${color}-400) !important;`;
			setColor(newColor);
			setShow(showValue);
		};

		return (
			<>
				<style jsx global>{`
					body {
						background-color: var(--chakra-colors-${color}-400) !important;
						transition-property: background-color;
						transition-duration: unset;
					}
				`}</style>
				<GridItem colSpan={4} background={`${color}.400`} p={10} gap={5}>
					<Heading
						as="h1"
						size="lg"
						color="whiteAlpha.700"
						letterSpacing="0.1em"
						textAlign="center"
					>
						The Stolen Wallet Registry
					</Heading>
					<Center>
						<ColorButton
							m={[5, 10, 20]}
							buttonText={show === 'features' ? 'Home' : 'Features'}
							onClickHandler={() => handleOnClick(show === 'features' ? 'home' : 'features')}
						/>
						<ColorButton
							m={[5, 10, 20]}
							buttonText={show === 'why' ? 'Home' : 'Why?'}
							onClickHandler={() => handleOnClick(show === 'why' ? 'home' : 'why')}
						/>
						<ColorButton
							m={[5, 10, 20]}
							buttonText={show === 'how' ? 'Home' : 'How?'}
							onClickHandler={() => handleOnClick(show === 'how' ? 'home' : 'how')}
						/>
						<ColorButton
							m={[5, 10, 20]}
							buttonText={show === 'about' ? 'Home' : 'About'}
							onClickHandler={() => handleOnClick(show === 'about' ? 'home' : 'about')}
						/>
					</Center>
				</GridItem>
			</>
		);
	};

	const AboutSection = () => {
		return (
			<>
				<SectionTitle title="About" selectedColor={color}>
					<p>this is a paramgraph</p>
				</SectionTitle>
				<SectionBody selectedColor={color}>
					<p>this is the body</p>
				</SectionBody>
			</>
		);
	};

	const WhySection = () => {
		return (
			<>
				<SectionTitle title="Why?" selectedColor={color}>
					<p>this is a paramgraph</p>
				</SectionTitle>
				<SectionBody selectedColor={color}>
					<p>this is the body</p>
				</SectionBody>
			</>
		);
	};

	const HowSection = () => {
		return (
			<>
				<SectionTitle title="How?" selectedColor={color}>
					<p>this is a paramgraph</p>
				</SectionTitle>
				<SectionBody selectedColor={color}>
					<p>this is the body</p>
				</SectionBody>
			</>
		);
	};

	const MainSection = () => {
		return (
			<>
				<SectionTitle title="Home" selectedColor={color}>
					<p>this is a paramgraph</p>
				</SectionTitle>
				<SectionTitle title="Home" selectedColor={color}>
					<p>this is a paramgraph</p>
				</SectionTitle>
				<SectionTitle title="Home" selectedColor={color}>
					<p>this is a paramgraph</p>
				</SectionTitle>
			</>
		);
	};

	return (
		<Layout setBGColor={color}>
			<Box h="90vh" gap={5} ml={40} mr={40} pb={5}>
				<Hero />
				<SimpleGrid minChildWidth={250} gap={10} height={500}>
					{show === 'home' && <MainSection />}
					{show === 'features' && <FeaturesSection color={color} />}
					{show === 'why' && <WhySection />}
					{show === 'how' && <HowSection />}
					{show === 'about' && <AboutSection />}
				</SimpleGrid>
			</Box>
		</Layout>
	);
};

export default Home;
