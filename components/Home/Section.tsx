import { GridItem, Heading, Box } from '@chakra-ui/react';
import React from 'react';

interface SectionTitleProps {
	title: string;
	selectedColor: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, selectedColor, children }) => {
	return (
		<GridItem
			boxShadow="inner"
			colSpan={1}
			background="gray.50"
			border={`5px solid ${selectedColor}.300`}
		>
			<Box backgroundColor={`${selectedColor}.200`} height="15px"></Box>
			<Box backgroundColor={`${selectedColor}.100`} height="15px"></Box>
			<Heading textAlign="center">{title}</Heading>
			{children}
		</GridItem>
	);
};

interface SectionBodyProps {
	selectedColor: string;
}

const SectionBody: React.FC<SectionBodyProps> = ({ selectedColor, children }) => {
	return (
		<GridItem
			boxShadow="inner"
			colSpan={2}
			background="gray.50"
			border={`5px solid ${selectedColor}.300`}
		>
			<Box backgroundColor={`${selectedColor}.200`} height="15px"></Box>
			<Box backgroundColor={`${selectedColor}.100`} height="15px"></Box>
			{children}
		</GridItem>
	);
};

export { SectionTitle, SectionBody };
