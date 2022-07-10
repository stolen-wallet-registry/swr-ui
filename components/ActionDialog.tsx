import {
	useDisclosure,
	Button,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
} from '@chakra-ui/react';
import React from 'react';

interface AlertModalProps {
	title: string;
	heading: string;
	cancelBtnText: string;
	actionBtnText: string;
	onAction: () => void;
	children: React.ReactNode;
}

const ActionModal: React.FC<AlertModalProps> = ({
	title,
	heading,
	cancelBtnText,
	actionBtnText,
	onAction,
	children,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

	return (
		<>
			<Button colorScheme="red" onClick={onOpen}>
				{title}
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							{heading}
						</AlertDialogHeader>

						<AlertDialogBody>{children}</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef as React.LegacyRef<HTMLButtonElement>} onClick={onClose}>
								{cancelBtnText}
							</Button>
							<Button colorScheme="red" onClick={onAction} ml={3}>
								{actionBtnText}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};
