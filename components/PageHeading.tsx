import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';

interface PageHeadingInterface {
	heading?: string;
	subHeading?: string;
	invert?: boolean;
}

export const PageHeading: React.FC<PageHeadingInterface> = ({
	heading,
	subHeading,
	invert = true,
}) => {
	return (
		<Flex mt={10} mb={10} flexDirection="column">
			<Heading size="lg" letterSpacing="0.1em" textAlign="center">
				{heading}
			</Heading>
			{subHeading && (
				<Heading
					color={invert ? 'white' : 'gray.800'}
					backgroundColor={invert ? 'gray.800' : 'white'}
					textShadow={
						invert ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;' : ''
					}
					boxShadow={
						invert ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;' : ''
					}
					size="sm"
					letterSpacing="0.1em"
					textAlign="center"
				>
					{subHeading}
				</Heading>
			)}
		</Flex>
	);
};
