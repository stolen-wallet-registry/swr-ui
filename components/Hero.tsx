import Head from 'next/head';
import { Box, Heading, Container, Text, Button, Stack, ChakraProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Hero: React.FC<ChakraProps> = ({ ...props }) => {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push('/dapp');
	};

	return (
		<>
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<Container {...props}>
				<Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }}>
					<Heading
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
						lineHeight={'110%'}
					>
						Dolore laborum in ut esse <br />
						<Text as={'span'} color={'green.400'}>
							Aute ad nostrud commodo labore cupidatat.
						</Text>
					</Heading>
					<Text color={'gray.500'}>
						Dolore commodo ut minim enim minim est est eu veniam ut. Amet commodo occaecat pariatur
						sint. Et enim culpa deserunt aliqua veniam ut laborum officia do irure.
					</Text>
					<Stack
						direction={'column'}
						spacing={3}
						align={'center'}
						alignSelf={'center'}
						position={'relative'}
					>
						<Button
							colorScheme={'green'}
							bg={'green.400'}
							rounded={'full'}
							px={6}
							_hover={{
								bg: 'green.500',
							}}
							onClick={handleClick}
						>
							Get Started
						</Button>
						<Button
							colorScheme={'blue'}
							size={'sm'}
							rounded={'full'}
							px={6}
							_hover={{
								bg: 'green.500',
							}}
						>
							Docs
						</Button>
					</Stack>
				</Stack>
			</Container>
		</>
	);
};

export default Hero;
