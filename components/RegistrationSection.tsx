import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';

export interface RegistrationSectionProps {
	title: string;
	children: React.ReactNode;
}

const RegistrationSection: React.FC<RegistrationSectionProps> = ({ title, children, ...rest }) => {
	return (
		<Flex
			{...rest}
			w={[650, 800, 900]}
			borderRadius={10}
			p={10}
			boxShadow="base"
			flexDirection="column"
			border="2px solid RGBA(0, 0, 0, 0.50)"
		>
			<Heading size="md" pb={5} pt={5}>
				{title}
			</Heading>
			{children}
		</Flex>
	);
};

export default RegistrationSection;
