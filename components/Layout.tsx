import { Flex } from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout: React.FunctionComponent<{}> = ({ children }) => {
	return (
		<Flex direction="column" w="100%" minH="100vh">
			<Header p={10} minH="100px" border="1px solid black" />
			{children}
			<Footer p={10} borderTop="1px solid black" />
		</Flex>
	);
};

export default Layout;
