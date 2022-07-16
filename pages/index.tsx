import Layout, { COLORS, ColorValues } from '../components/Layout';

import type { NextPage } from 'next';
import { Center, Heading, Grid, GridItem, Box } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';
import ColorButton from '../components/ColorButton';

import { SectionTitle, SectionBody } from '../components/Section';
import { COLOR_TRANSITION_DELAY } from '../theme/theme';

type showColorProps = 'home' | 'about' | 'why' | 'how';

const randomColor = () => {
	return Math.floor(Math.random() * 4);
};

const Home: NextPage = () => {
	const initialColor = COLORS[randomColor()];
	const [color, setColor] = useState<ColorValues>(initialColor);
	const [show, setShow] = useState<showColorProps>('home');

	const Hero = () => {
		const handleOnClick = (showValue: showColorProps) => {
			const colorPicks = COLORS.filter((c) => c !== color);
			const newColor = colorPicks[randomColor()];
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
				<GridItem colSpan={3} background={`${color}.400`} p={10} gap={5}>
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
			<Grid
				h="90vh"
				templateRows="1fr 3fr"
				gap={5}
				templateColumns="repeat(3, 1fr)"
				ml={40}
				mr={40}
				pb={5}
			>
				<Hero />
				{show === 'home' && <MainSection />}
				{show === 'why' && <WhySection />}
				{show === 'how' && <HowSection />}
				{show === 'about' && <AboutSection />}
			</Grid>
		</Layout>
	);
};

export default Home;
