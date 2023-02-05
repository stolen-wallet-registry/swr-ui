import { Center, Spinner, useColorMode } from '@chakra-ui/react';

const Loader = () => {
	const { colorMode } = useColorMode();

	return (
		<Center>
			<Spinner
				thickness="4px"
				speed="0.65s"
				emptyColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpa.800'}
				color={colorMode === 'light' ? 'gray.800' : 'white'}
				size="xl"
			/>
		</Center>
	);
};

export default Loader;
