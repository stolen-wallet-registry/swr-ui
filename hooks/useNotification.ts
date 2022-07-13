import React from 'react';
import { useToast, UseToastOptions, ToastId } from '@chakra-ui/react';

interface ToastOpts extends UseToastOptions {
	varient?: string;
}

const useNotification = () => {
	const toast = useToast();
	const toastIdRef = React.useRef<ToastId>();

	const defaults: ToastOpts = {
		duration: 9000,
		isClosable: true,
		varient: 'top-accent',
		position: 'bottom-right',
	};

	const addToast = ({ title, description, status }: UseToastOptions) => {
		toastIdRef.current = toast({ title, description, status, ...defaults });
	};

	return {
		notifySuccess(title: string, description: string) {
			addToast({ title, description, status: 'success' });
		},
		notifyError(title: string, description: string) {
			addToast({ title, description, status: 'error' });
		},
		notifyWarning(title: string, description: string) {
			addToast({ title, description, status: 'warning' });
		},
		notifyInfo(title: string, description: string) {
			addToast({ title, description, status: 'info' });
		},
		notify(args: UseToastOptions) {
			toast(args);
		},
	};
};

export default useNotification;
