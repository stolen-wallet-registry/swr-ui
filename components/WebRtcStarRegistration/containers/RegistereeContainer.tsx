import { Flex, useMediaQuery } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRegistereeSteps } from '@utils/types';
import { Libp2p } from 'libp2p';
import React, { useEffect, useState } from 'react';
import { PeerList } from '../PeerList';
import { ConnectToPeer } from '../Registeree/ConnectToPeer';
import AcknowledgeAndSign from '../Registeree/AcknowledgeAndSign';
import WaitForAcknowledgementPayment from '../Registeree/WaitForAcknowledgementPayment';
import WaitForRegistrationPayment from '../Registeree/WaitForRegistrationPayment';
import RegisterAndSign from '../Registeree/RegisterAndSign';

import GracePeriod from '@components/SharedRegistration/GracePeriod';

import { multiaddr, MultiaddrInput } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { registereeConnectMessage } from '@utils/libp2p';
import { BigNumber } from 'ethers';
import { SessionExpired } from '../SessionExpired';
import { RegistreeSuccess } from '../Registeree/RegistreeSuccess';

interface RegistreeContainerProps {
	step: P2PRegistereeSteps;
	setStep: (step: P2PRegistereeSteps) => void;
	libp2p: Libp2p;
	address: string;
	onOpen: () => void;
}

const RegistereeContainer: React.FC<RegistreeContainerProps> = ({
	step,
	setStep,
	libp2p,
	address,
	onOpen,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const [connected, setIsConnected] = useState(false);
	const [status, setStatus] = useState('waiting to connect to peer.');
	const [error, setError] = useState<Error | unknown>();
	const [tempRelayer, setTempRelayer] = useState('');
	const [isLargerThan500] = useMediaQuery('(min-width: 500px)');

	const setConnectToPeerInfo = async (
		e: React.MouseEvent<HTMLElement>,
		peerId: string,
		multiaddress: MultiaddrInput
	) => {
		e.preventDefault();
		setStatus('trying to connect...');
		try {
			const connPeerId = peerIdFromString(peerId);
			const connAddr = multiaddr(multiaddress);

			setLocalState({
				connectToPeer: connPeerId.toString(),
				connectToPeerAddrs: connAddr!.toString(),
			});

			try {
				const stat = await registereeConnectMessage({ libp2p, localState });
				console.log(stat);

				if (stat?.timeline) {
					setIsConnected(true);
				} else {
					setIsConnected(false);
				}
			} catch (error) {
				console.log(error);
				setError(error);
				setIsConnected(false);
			}
		} catch (error) {
			console.log(error);

			setStatus(`failed to connect: ${error}`);
		}
	};

	// const resolveExpirey = async () => {
	// 	const registryContract = StolenWalletRegistryFactory.connect(
	// 		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
	// 		signer!
	// 	);

	// 	const isExpired = await registryContract.regististrationPeriodExpired();

	// 	setRegistrationExpired(isExpired);
	// };

	// useEffect(() => {
	// 	if (
	// 		step === P2PRegistereeSteps.GracePeriod ||
	// 		step === P2PRegistereeSteps.RegisterAndSign ||
	// 		step === P2PRegistereeSteps.WaitForRegistrationPayment
	// 	) {
	// 		resolveExpirey();
	// 	}
	// }, [step]);

	useEffect(() => {
		setStep(localState.step as P2PRegistereeSteps);
	}, []);

	return (
		<Flex
			mt={3}
			mb={10}
			p={5}
			gap={5}
			flexDirection={isLargerThan500 ? 'row' : 'column'}
			justifyContent="center"
		>
			{libp2p && localState.connectToPeer && (
				<PeerList
					connected={connected}
					libp2p={libp2p!}
					peerId={localState?.connectToPeer}
					multiaddress={localState?.connectToPeerAddrs}
				/>
			)}
			{step === P2PRegistereeSteps.ConnectToPeer && (
				<ConnectToPeer setConnectToPeerInfo={setConnectToPeerInfo} />
			)}
			{step === P2PRegistereeSteps.AcknowledgeAndSign && (
				<AcknowledgeAndSign
					libp2p={libp2p!}
					tempRelayer={tempRelayer}
					setTempRelayer={setTempRelayer}
					address={address!}
					onOpen={onOpen}
					setNextStep={() =>
						setLocalState({ step: P2PRegistereeSteps.WaitForAcknowledgementPayment })
					}
				/>
			)}
			{step === P2PRegistereeSteps.WaitForAcknowledgementPayment && (
				<WaitForAcknowledgementPayment />
			)}
			{step === P2PRegistereeSteps.GracePeriod && (
				<GracePeriod
					setNextStep={() => {
						setStep(P2PRegistereeSteps.RegisterAndSign);
						setLocalState({ step: P2PRegistereeSteps.RegisterAndSign });
					}}
				/>
			)}
			{step === P2PRegistereeSteps.RegisterAndSign && (
				<RegisterAndSign
					address={address}
					onOpen={onOpen}
					setNextStep={() => {
						setStep(P2PRegistereeSteps.WaitForRegistrationPayment);
						setLocalState({ step: P2PRegistereeSteps.WaitForRegistrationPayment });
					}}
				/>
			)}
			{step === P2PRegistereeSteps.WaitForRegistrationPayment && <WaitForRegistrationPayment />}
			{step === P2PRegistereeSteps.Success && <RegistreeSuccess />}
			{step === P2PRegistereeSteps.Expired && <SessionExpired />}
		</Flex>
	);
};

export default RegistereeContainer;
