import {
	useDisclosure,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from '@chakra-ui/react';

interface SWRModalProps {
	title: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	actions?: JSX.Element;
}

const SWRModal: React.FC<SWRModalProps> = ({
	title,
	size = 'full',
	isOpen,
	onOpen,
	onClose,
	actions,
	children,
}) => {
	return (
		<>
			<Button onClick={onOpen}>Trigger modal</Button>

			<Modal onClose={onClose} size={size} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>{children}</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
						{actions}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default SWRModal;
