import { Box, ButtonGroup, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaGithubSquare, FaTwitterSquare } from 'react-icons/fa';
import Header from './Header';

export type ColorValues = 'red' | 'teal' | 'blue' | 'green' | 'purple';
export const COLORS: ColorValues[] = ['red', 'teal', 'blue', 'green', 'purple'];
interface LayoutProps {
	isDapp?: boolean;
	setBGColor: ColorValues;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ isDapp, setBGColor, children }) => {
	const Footer = () => {
		return (
			<Box position="fixed" bottom={0} right={0}>
				<ButtonGroup p={2} mr={5}>
					<IconButton
						aria-label="Twitter"
						variant="ghost"
						opacity={0.8}
						_hover={{
							transform: 'scale(2.5)',
							opacity: 1,
							borderColor: 'gray.100',
							color: 'gray.100',
						}}
						_active={{ transform: 'translateY(-2px)' }}
						icon={<FaTwitterSquare color="white" />}
					/>
					<IconButton
						aria-label="Github"
						variant="ghost"
						opacity={0.8}
						_hover={{
							transform: 'scale(2.5)',
							opacity: 1,
							borderColor: 'gray.100',
							color: 'gray.100',
						}}
						_active={{ transform: 'translateY(-2px)' }}
						icon={<FaGithubSquare color="white" />}
					/>
				</ButtonGroup>
			</Box>
		);
	};
	return (
		<Box position="absolute" top={0} left={0} right={0} bottom={0}>
			<Header />
			<Box backgroundColor={`${setBGColor}.600`} height={3}></Box>
			<Box backgroundColor={`${setBGColor}.500`} height={4}></Box>
			<Box backgroundColor={`${setBGColor}.400`} height={5}></Box>
			{children}
			<Box backgroundColor={`${setBGColor}.300`} height={5}></Box>
			<Box backgroundColor={`${setBGColor}.400`} height={4}></Box>
			<Box backgroundColor={`${setBGColor}.500`} height={2}></Box>
			<Box backgroundColor={`${setBGColor}.600`} height={2}></Box>
			<Footer />
		</Box>
	);
};

export default Layout;
