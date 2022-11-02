import { Box, ButtonGroup, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaTwitterSquare, FaGithubSquare } from 'react-icons/fa';
import MadeFrom from './MadeFrom';

interface FooterProps {
	color: string;
	opacity: number;
	addBox?: boolean;
	children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ color, opacity, addBox = false, children }) => {
	return (
		<>
			{addBox && <Box height={5} mt={10}></Box>}
			<Box position="fixed" bottom={0} right={0}>
				<ButtonGroup p={2} mt={10} mr={5}>
					<Box position="fixed" bottom={2} left="50%" transform="translateX(-50%)">
						<MadeFrom />
					</Box>
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
