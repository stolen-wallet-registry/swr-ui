import { GridItem, Heading, Box } from '@chakra-ui/react';
import React from 'react';

interface SectionTitleProps {
	title: string;
	selectedColor: string;
	children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
	title,
	selectedColor,
	children,
	...props
}) => {
	return (
		<GridItem
			{...props}
			borderRadius={10}
			boxShadow="dark-lg"
			colSpan={1}
			background="gray.50"
			border={`5px solid ${selectedColor}.300`}
		>
			<Box
				borderRadius="10px 10px 0 0"
				backgroundColor={`${selectedColor}.200`}
				height="15px"
			></Box>
			<Box mb={5} backgroundColor={`${selectedColor}.100`} height="15px"></Box>
			<Heading textAlign="center">{title}</Heading>
			<Box p={5}>{children}</Box>
		</GridItem>
	);
};

interface SectionBodyProps {
	selectedColor: string;
	children: React.ReactNode;
}

const SectionBody: React.FC<SectionBodyProps> = ({ selectedColor, children }) => {
	return (
		<GridItem
			boxShadow="2xl"
			colSpan={2}
			background="gray.50"
			border={`5px solid ${selectedColor}.300`}
			borderRadius={10}
		>
			<Box
				backgroundColor={`${selectedColor}.200`}
				borderRadius="10px 10px 0 0"
				height="15px"
			></Box>
			<Box backgroundColor={`${selectedColor}.100`} height="15px"></Box>
			<Box p={5}>{children}</Box>
		</GridItem>
	);
};

export { SectionTitle, SectionBody };
