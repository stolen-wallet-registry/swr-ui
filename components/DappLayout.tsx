import { Box } from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';
import { DappHeader } from './Header';
import MadeFrom from './MadeFrom';

export type ColorValues = 'red' | 'teal' | 'blue' | 'green' | 'purple';
export const COLORS: ColorValues[] = ['red', 'teal', 'blue', 'green', 'purple'];
interface DappLayoutProps {
	children: React.ReactNode;
}

const DappLayout: React.FunctionComponent<DappLayoutProps> = ({ children }) => {
	return (
		<Box minHeight="100vh" height="100%" position="absolute" top={0} left={0} right={0} bottom={0}>
			<DappHeader />
			{children}
			<Footer color="black" opacity={0.8} addBox={true}>
				<Box position="fixed" bottom={2} left="50%" transform="translateX(-50%)">
					<MadeFrom />
				</Box>
			</Footer>
		</Box>
	);
};

export default DappLayout;
