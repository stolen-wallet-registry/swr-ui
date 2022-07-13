import { Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
	isDapp?: boolean;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ isDapp, children }) => {
	return (
		<Flex direction="column" w="100%" minH="100vh">
			{isDapp && (
				<>
					<Header p={5} minH="50px" border="1px solid black" />
					<Divider borderColor="gray.200" pb={10} />
				</>
			)}
			{children}
			<Divider borderColor="gray.200" pb={10} />
			<Footer p={10} borderTop="1px solid black" />
		</Flex>
	);
};

export default Layout;
