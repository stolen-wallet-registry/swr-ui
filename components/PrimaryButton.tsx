import { Button, ButtonProps, ChakraProps } from '@chakra-ui/react';
import React from 'react';

interface PrimaryButtonProps extends ButtonProps {
	colorScheme?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ colorScheme, children, ...props }) => {
	return (
		<Button
			width={[150, 250]}
			_hover={{ transform: 'scale(1.1)' }}
			_active={{ transform: 'translateY(-2px)' }}
			colorScheme={colorScheme || 'whiteAlpha'}
			boxShadow="2xl"
			{...props}
		>
			{children}
		</Button>
	);
};

export default PrimaryButton;
