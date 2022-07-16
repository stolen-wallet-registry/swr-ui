import { Box, ButtonGroup, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaGithubSquare, FaTwitterSquare } from 'react-icons/fa';
import Footer from './Footer';
import { HomeHeader } from './Header';

export type ColorValues = 'red' | 'teal' | 'blue' | 'green' | 'purple';
export const COLORS: ColorValues[] = ['red', 'teal', 'blue', 'green', 'purple'];
interface LayoutProps {
	setBGColor: ColorValues;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ setBGColor, children }) => {
	return (
		<Box position="absolute" top={0} left={0} right={0} bottom={0}>
			<HomeHeader />
			<Box backgroundColor={`${setBGColor}.600`} height={3}></Box>
			<Box backgroundColor={`${setBGColor}.500`} height={4}></Box>
			<Box backgroundColor={`${setBGColor}.400`} height={5}></Box>
			{children}
			<Box backgroundColor={`${setBGColor}.300`} height={5}></Box>
			<Box backgroundColor={`${setBGColor}.400`} height={4}></Box>
			<Box backgroundColor={`${setBGColor}.500`} height={2}></Box>
			<Box backgroundColor={`${setBGColor}.600`} height={2}></Box>
			<Footer color="white" opacity={0.8} />
		</Box>
	);
};

export default Layout;
