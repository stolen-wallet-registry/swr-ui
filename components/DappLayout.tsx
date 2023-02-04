import { Box, Text, Button, Flex, useDisclosure } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { RegistrationTypes } from '@utils/types';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import ButtonChoices from './ButtonChoices';
import Footer from './Footer';
import { DappHeader } from './Header';
// import MadeFrom from './MadeFrom';
import { PageHeading } from './PageHeading';
import PreviewModal from './PreviewModal';

export type ColorValues = 'red' | 'teal' | 'blue' | 'green' | 'purple';
export const COLORS: ColorValues[] = ['red', 'teal', 'blue', 'green', 'purple'];
interface DappLayoutProps {
	children: React.ReactNode;
	heading?: string;
	subHeading?: string;
	showButton?: boolean;
	isOpen?: boolean;
	onClose?: () => void;
}

const DappLayout: React.FunctionComponent<DappLayoutProps> = ({
	children,
	heading,
	subHeading,
	showButton = true,
	isOpen,
	onClose,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const [localState, _, resetLocalState] = useLocalStorage();
	const { address } = useAccount();
	const { chain } = useNetwork();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const AttributesComponent = ({ localState }: { localState: any }) => {
		const values = Object.keys(localState).map((k) => `${k} - ${localState[k]}`);

		return (
			<>
				{values.map((v, i) => (
					<Text key={i}>{v}</Text>
				))}
			</>
		);
	};

	const resetState = () => {
		resetLocalState(address, chain?.id);

		router.replace(`/dapp`, undefined, { shallow: true });
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Box minHeight="100vh" height="100%" position="absolute" top={0} left={0} right={0} bottom={0}>
			<DappHeader />
			{/* <Text>localState:</Text> */}
			{/* <AttributesComponent localState={localState} /> */}
			<PageHeading heading="Registration Options" subHeading="The Stolen Wallet Registry" />
			{heading && <PageHeading {...{ heading, subHeading }} invert={false} />}
			{showButton && (
				<Flex justifyContent="center">
					<Button size="lg" onClick={resetState}>
						Reset Session
					</Button>
				</Flex>
			)}
			{children}
			<Footer color="black" opacity={0.8} addBox={true} />
			<PreviewModal isOpen={isOpen!} onClose={onClose!} />
		</Box>
	);
};

export default DappLayout;
