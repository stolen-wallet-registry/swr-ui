import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from '@chakra-ui/react';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import React from 'react';
// const { isOpen, onOpen, onClose } = useDisclosure()
{
	/* <Button onClick={onOpen}>Open Modal</Button> */
}
interface CompletionStepsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CompletionStepsModal = ({ isOpen, onClose }: CompletionStepsModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Modal Title</ModalHeader>
				<ModalCloseButton />
				<ModalBody width="fit-content">
					<CompletionSteps />
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={onClose}>
						Close
					</Button>
					<Button variant="ghost">Secondary Action</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
