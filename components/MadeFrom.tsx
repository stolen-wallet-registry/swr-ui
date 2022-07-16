import { HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { GiTechnoHeart, GiCoffeeCup } from 'react-icons/gi';

const MadeFrom = () => {
	return (
		<HStack letterSpacing="0.05em" justify="center" align="center">
			<Text>Made with</Text>
			<GiTechnoHeart color="#F56565" size="30px" />
			<Text>and</Text>
			<GiCoffeeCup color="#ED8936" size="30px" style={{ marginBottom: '10px' }} />
			<Text>for</Text>
			<Text fontWeight="bold">Public Goods</Text>
		</HStack>
	);
};

export default MadeFrom;
