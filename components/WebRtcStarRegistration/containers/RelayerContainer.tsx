import { Flex } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';
import { Libp2p } from 'libp2p';
import React, { useState } from 'react';
import { PeerList } from '../PeerList';
import { ConnectToPeer } from '../Registeree/ConnectToPeer';
import AcknowledgeAndSign from '../Registeree/AcknowledgeAndSign';
import WaitForAcknowledgementPayment from '../Registeree/WaitForAcknowledgementPayment';
import WaitForRegistrationPayment from '../Registeree/WaitForRegistrationPayment';
import RegisterAndSign from '../Registeree/RegisterAndSign';
import AcknowledgementPeerPayment from '../Relayer/AcknowledgementPayment';

import GracePeriod from '../GracePeriod';
import RegisterPeerPayment from '../Relayer/RegistrationPayment';

import { multiaddr, MultiaddrInput } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { sendConnectMessage } from '@utils/libp2p';
import WaitForAcknowledgementSign from '../Relayer/WaitForAcknowledgementSign';
import WaitForConnection from '../Relayer/WaitForConnection';
import WaitForRegistrationSign from '../Relayer/WaitForRegistrationSign';
import AcknowledgementPayment from '../Relayer/AcknowledgementPayment';
import RegistrationPayment from '../Relayer/RegistrationPayment';

interface RelayerContainerProps {
	libp2p: Libp2p;
	address: string;
	onOpen: () => void;
}

const RealyerContainer: React.FC<RelayerContainerProps> = ({ libp2p, address, onOpen }) => {
	const [localState, setLocalState] = useLocalStorage();
	const [connected, setIsConnected] = useState(false);
	const [status, setStatus] = useState('waiting to connect to peer.');
	const [error, setError] = useState<Error | unknown>();

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
			debugger;
			setLocalState({
				connectToPeer: connPeerId.toString(),
				connectToPeerAddrs: [connAddr!.toString()],
			});

			try {
				const stat = await sendConnectMessage({ libp2p, localState });
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

	return (
		<Flex mt={3} mb={10} p={5} gap={5}>
			<ConnectToPeer setConnectToPeerInfo={setConnectToPeerInfo} />
			{libp2p && localState.connectToPeer && (
				<>
					<PeerList
						connected={connected}
						libp2p={libp2p!}
						peerId={localState?.connectToPeer}
						multiaddress={localState?.connectToPeerAddrs?.[0]}
					/>
				</>
			)}
			{localState.step === P2PRelayerSteps.WaitForConnection && <WaitForConnection />}
			{localState.step === P2PRelayerSteps.WaitForAcknowledgementSign && (
				<WaitForAcknowledgementSign />
			)}
			{localState.step === P2PRelayerSteps.AcknowledgementPayment && <AcknowledgementPayment />}
			{localState.step === P2PRelayerSteps.GracePeriod && <GracePeriod />}
			{localState.step === P2PRelayerSteps.WaitForRegistrationSign && <WaitForRegistrationSign />}
			{/* {localState.step === P2PRelayerSteps.RegistrationPayment && <RegistrationPayment />} */}
			{/* {libp2p && localState.connectToPeer && (
				<PeerList
					connected={connected}
					libp2p={libp2p!}
					peerId={localState?.connectToPeer}
					multiaddress={localState?.connectToPeerAddrs}
				/>
			)}
			{localState.step === P2PRegistereeSteps.ConnectToPeer && (
				<ConnectToPeer setConnectToPeerInfo={setConnectToPeerInfo} />
			)}
			{localState.step === P2PRegistereeSteps.AcknowledgeAndSign && (
				<AcknowledgeAndSign
					address={address!}
					onOpen={onOpen}
					setNextStep={() =>
						setLocalState({ step: P2PRegistereeSteps.WaitForAcknowledgementPayment })
					}
				/>
			)}
			{localState.step === P2PRegistereeSteps.WaitForAcknowledgementPayment && (
				<WaitForAcknowledgementPayment />
			)}
			{localState.step === P2PRegistereeSteps.GracePeriod && <GracePeriod />}
			{localState.step === P2PRegistereeSteps.RegisterAndSign && (
				<RegisterAndSign
					address={address}
					onOpen={onOpen}
					setNextStep={() => setLocalState({ step: P2PRegistereeSteps.WaitForRegistrationPayment })}
				/>
			)}
			{localState.step === P2PRegistereeSteps.WaitForRegistrationPayment && (
				<WaitForRegistrationPayment />
			)} */}
		</Flex>
	);
};

export default RealyerContainer;
