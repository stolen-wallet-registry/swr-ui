import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRelayerSteps } from '@utils/types';
import { Libp2p } from 'libp2p';
import React, { useEffect } from 'react';
import GracePeriod from '@components/SharedRegistration/GracePeriod';

import { useSigner } from 'wagmi';
import { PeerList } from '../PeerList';
import AcknowledgementPayment from '../Relayer/AcknowledgementPayment';
import RegistrationPayment from '../Relayer/RegistrationPayment';
import { SessionExpired } from '@components/SharedRegistration/DisplayPrompts';
import {
	RelayerSuccess,
	WaitForAcknowledgementSign,
	WaitForConnection,
	WaitForRegistrationSign,
} from '../RelayerShared';

interface RelayerContainerProps {
	step: P2PRelayerSteps;
	setStep: (step: P2PRelayerSteps) => void;
	libp2p: Libp2p;
	address: string;
	onOpen: () => void;
}

const RealyerContainer: React.FC<RelayerContainerProps> = ({
	step,
	setStep,
	libp2p,
	address,
	onOpen,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const { data: signer } = useSigner();

	useEffect(() => {
		setStep(localState.step as P2PRelayerSteps);
	}, []);

	return (
		<>
			{step === P2PRelayerSteps.WaitForConnection && <WaitForConnection />}
			{step === P2PRelayerSteps.WaitForAcknowledgementSign && (
				<WaitForAcknowledgementSign libp2p={libp2p} localState={localState} />
			)}
			{step === P2PRelayerSteps.AcknowledgementPayment && (
				<AcknowledgementPayment
					libp2p={libp2p}
					setNextStep={() => {
						setStep(P2PRelayerSteps.GracePeriod);
						setLocalState({ step: P2PRelayerSteps.GracePeriod });
					}}
				/>
			)}
			{step === P2PRelayerSteps.GracePeriod && (
				<GracePeriod
					signer={signer!}
					address={localState.trustedRelayerFor!}
					setExpiryStep={() => {
						setStep(P2PRelayerSteps.WaitForRegistrationSign);
						setLocalState({ step: P2PRelayerSteps.WaitForRegistrationSign });
					}}
				/>
			)}
			{step === P2PRelayerSteps.WaitForRegistrationSign && (
				<WaitForRegistrationSign
					signer={signer!}
					address={localState.trustedRelayerFor!}
					setExpiryStep={() => {
						setStep(P2PRelayerSteps.Expired);
						setLocalState({ step: P2PRelayerSteps.Expired });
					}}
				/>
			)}
			{step === P2PRelayerSteps.RegistrationPayment && (
				<RegistrationPayment
					libp2p={libp2p}
					signer={signer!}
					address={localState.trustedRelayerFor!}
					onOpen={onOpen}
					setNextStep={() => {
						setStep(P2PRelayerSteps.Success);
						setLocalState({ step: P2PRelayerSteps.Success });
					}}
					setExpiryStep={() => {
						setStep(P2PRelayerSteps.Expired);
						setLocalState({ step: P2PRelayerSteps.Expired });
					}}
				/>
			)}
			{step === P2PRelayerSteps.Success && <RelayerSuccess />}
			{step === P2PRelayerSteps.Expired && <SessionExpired />}
			{libp2p && (
				<PeerList
					libp2p={libp2p!}
					peerId={localState?.connectToPeer}
					multiaddress={localState?.connectToPeerAddrs}
				/>
			)}
		</>
	);
};

export default RealyerContainer;
