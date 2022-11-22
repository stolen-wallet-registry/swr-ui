import { Flex, useMediaQuery } from '@chakra-ui/react';
import useLocalStorage, { accessLocalStorage } from '@hooks/useLocalStorage';
import { P2PRegistereeSteps } from '@utils/types';
import { Libp2p } from 'libp2p';
import React, { useEffect, useState } from 'react';

import GracePeriod from '@components/SharedRegistration/GracePeriod';

import { multiaddr, MultiaddrInput } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { passStreamData, PROTOCOLS } from '@utils/libp2p';
import { useSigner } from 'wagmi';
import { SessionExpired } from '@components/SharedRegistration/SessionExpired';
import { PeerList } from '../PeerList';
import AcknowledgeAndSign from '../Registeree/AcknowledgeAndSign';
import { ConnectToPeer } from '../Registeree/ConnectToPeer';
import RegisterAndSign from '../Registeree/RegisterAndSign';
import { RegistreeSuccess } from '../Registeree/RegistreeSuccess';
import WaitForAcknowledgementPayment from '../Registeree/WaitForAcknowledgementPayment';
import WaitForRegistrationPayment from '../Registeree/WaitForRegistrationPayment';

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
	const [tempRelayer, setTempRelayer] = useState('');
	const [isSmallerThan1000] = useMediaQuery('(max-width: 1200px)');
	const { data: signer, status: st } = useSigner();

	const setConnectToPeerInfo = async (
		e: React.MouseEvent<HTMLElement>,
		peerId: string,
		multiaddress: MultiaddrInput
	) => {
		e.preventDefault();
		try {
			const connPeerId = peerIdFromString(peerId);
			const connAddr = multiaddr(multiaddress);

			setLocalState({
				connectToPeer: connPeerId.toString(),
				connectToPeerAddrs: connAddr!.toString(),
			});

			const state = accessLocalStorage();

			const relayerState = {
				network: state.network,
				includeWalletNFT: state.includeWalletNFT,
				includeSupportNFT: state.includeSupportNFT,
				connectToPeer: connPeerId.toString(),
				connectToPeerAddrs: connAddr!.toString(),
			};

			try {
				const stat = await passStreamData({
					libp2p,
					localState,
					streamData: JSON.stringify(relayerState),
					protocol: PROTOCOLS.CONNECT,
				});

				console.log(stat);

				if (stat?.timeline) {
					setIsConnected(true);
				} else {
					setIsConnected(false);
				}
			} catch (error) {
				console.log(error);
				setIsConnected(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	console.log({ status: st });

	useEffect(() => {
		setStep(localState.step as P2PRegistereeSteps);
	}, []);

	return (
		<>
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
						setLocalState({
							step: P2PRegistereeSteps.WaitForAcknowledgementPayment,
						})
					}
				/>
			)}
			{step === P2PRegistereeSteps.WaitForAcknowledgementPayment && (
				<WaitForAcknowledgementPayment />
			)}
			{step === P2PRegistereeSteps.GracePeriod && (
				<GracePeriod
					signer={signer!}
					address={address}
					setExpiryStep={() => {
						setStep(P2PRegistereeSteps.RegisterAndSign);
						setLocalState({ step: P2PRegistereeSteps.RegisterAndSign });
					}}
				/>
			)}
			{step === P2PRegistereeSteps.RegisterAndSign && (
				<RegisterAndSign
					libp2p={libp2p}
					signer={signer!}
					address={address}
					onOpen={onOpen}
					setNextStep={() => {
						setStep(P2PRegistereeSteps.WaitForRegistrationPayment);
						setLocalState({ step: P2PRegistereeSteps.WaitForRegistrationPayment });
					}}
					setExpiryStep={() => {
						setStep(P2PRegistereeSteps.Expired);
						setLocalState({ step: P2PRegistereeSteps.Expired });
					}}
				/>
			)}
			{step === P2PRegistereeSteps.WaitForRegistrationPayment && (
				<WaitForRegistrationPayment
					signer={signer!}
					address={address}
					setExpiryStep={() => {
						setStep(P2PRegistereeSteps.Expired);
						setLocalState({ step: P2PRegistereeSteps.Expired });
					}}
				/>
			)}
			{step === P2PRegistereeSteps.Success && <RegistreeSuccess />}
			{step === P2PRegistereeSteps.Expired && <SessionExpired />}
			{libp2p && localState.connectToPeer && (
				<PeerList
					libp2p={libp2p!}
					peerId={localState?.connectToPeer}
					multiaddress={localState?.connectToPeerAddrs}
				/>
			)}
		</>
	);
};

export default RegistereeContainer;
