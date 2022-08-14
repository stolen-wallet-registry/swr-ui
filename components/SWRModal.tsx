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
	onClose: () => void;
	actions?: JSX.Element;
}

const SWRModal: React.FC<SWRModalProps> = ({
	title,
	size = 'full',
	isOpen,
	onClose,
	actions,
	children,
}) => {
	return (
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
	);
};

interface ModalButtonProps {
	onOpen: () => void;
	content: string;
}

const ModalButton: React.FC<ModalButtonProps> = (props) => {
	return (
		<Button {...props} onClick={props.onOpen}>
			{props.children}
		</Button>
	);
};

export { SWRModal, ModalButton };
