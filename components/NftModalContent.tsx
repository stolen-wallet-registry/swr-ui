import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';

const NftModalContent = () => {
	return (
		<Flex flexDirection="column">
			<Box>
				<Heading as="h1">Support NFT</Heading>
				<Image src="../assets/stolen-wallet.svg" />
			</Box>
		</Flex>
	);
};

export default NftModalContent;
