import { Box, ButtonGroup, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaTwitterSquare, FaGithubSquare } from 'react-icons/fa';

interface FooterProps {
	color: string;
	opacity: number;
}

const Footer: React.FC<FooterProps> = ({ color, opacity, children }) => {
	return (
		<>
			<Box height={5} mt={10}></Box>
			<Box position="absolute" bottom={0} right={0}>
				<ButtonGroup p={2} mt={10} mr={5}>
					{children}
					<IconButton
						aria-label="Twitter"
						variant="ghost"
						opacity={opacity}
						_hover={{
							transform: 'scale(2.5)',
							opacity: 1,
							borderColor: 'gray.100',
							color: 'gray.100',
						}}
						_active={{ transform: 'translateY(-2px)' }}
						icon={<FaTwitterSquare color={color} />}
					/>
					<IconButton
						aria-label="Github"
						variant="ghost"
						opacity={opacity}
						_hover={{
							transform: 'scale(2.5)',
							opacity: 1,
							borderColor: 'gray.100',
							color: 'gray.100',
						}}
						_active={{ transform: 'translateY(-2px)' }}
						icon={<FaGithubSquare color={color} />}
					/>
				</ButtonGroup>
			</Box>
		</>
	);
};

export default Footer;
