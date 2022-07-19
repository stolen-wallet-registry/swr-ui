import { Button, ButtonProps, useColorModeValue } from '@chakra-ui/react';

interface ColorButtonProps extends ButtonProps {
	onClickHandler: any;
	buttonText: string;
}

const ColorButton = ({ buttonText, onClickHandler, ...props }: ColorButtonProps) => {
	return (
		<Button
			{...props}
			px={8}
			size="lg"
			rounded="lg"
			varient="outline"
			colorScheme="whiteAlpha"
			boxShadow="2xl"
			_hover={{ transform: 'scale(1.1)' }}
			_active={{ transform: 'translateY(-2px)' }}
			onClick={onClickHandler}
		>
			{buttonText}
		</Button>
	);
};

export default ColorButton;
