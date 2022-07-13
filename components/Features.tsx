import { Box, ChakraProps, Heading, SimpleGrid } from '@chakra-ui/react';

const Features: React.FC<ChakraProps> = ({ ...props }) => {
	return (
		<>
			<Heading
				as="h2"
				textAlign="center"
				fontSize={'4xl'}
				py={10}
				color={'green.400'}
				fontWeight={'bold'}
			>
				Features
			</Heading>
			<SimpleGrid pb={10} columns={2} {...props}>
				<Box backgroundColor="gray.100" height="400px" border="1px solid gray.100"></Box>
				<Box backgroundColor="black" height="400px" border="1px solid gray.100"></Box>
				<Box backgroundColor="black" height="400px" border="1px solid gray.100"></Box>
				<Box backgroundColor="gray.100" height="400px" border="1px solid gray.100"></Box>
				<Box backgroundColor="gray.100" height="400px" border="1px solid gray.100"></Box>
				<Box backgroundColor="black" height="400px" border="1px solid gray.100"></Box>
			</SimpleGrid>
		</>
	);
};

export default Features;
