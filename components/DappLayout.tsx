import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';
import { GiTechnoHeart, GiCoffeeCup } from 'react-icons/gi';
import { DappHeader } from './Header';

export type ColorValues = 'red' | 'teal' | 'blue' | 'green' | 'purple';
export const COLORS: ColorValues[] = ['red', 'teal', 'blue', 'green', 'purple'];
interface DappLayoutProps {}

const DappLayout: React.FunctionComponent<DappLayoutProps> = ({ children }) => {
	return (
		<Box minHeight="100vh" height="100%" position="absolute" top={0} left={0} right={0} bottom={0}>
			<DappHeader />
			{children}
			<Footer color="black" opacity={0.8}>
				<HStack pr={100} letterSpacing="0.1em">
					<Text fontWeight="bold">Made with </Text>
					<GiTechnoHeart color="red" />
					<Text fontWeight="bold">and</Text>
					<GiCoffeeCup color="brown" />
					<Text fontWeight="bold">from Denver, CO</Text>
				</HStack>
			</Footer>
		</Box>
	);
};

export default DappLayout;
