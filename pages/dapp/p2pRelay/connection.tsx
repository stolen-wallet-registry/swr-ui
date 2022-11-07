import { Text, Flex, useDisclosure, Box } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRelaySteps } from '@utils/types';
import React, { useEffect } from 'react';

import { Libp2p } from 'libp2p';
import { PeerId } from '@libp2p/interface-peer-id';
import { Multiaddr, multiaddr, MultiaddrInput } from '@multiformats/multiaddr';

import { startLibp2p } from '@utils/libp2p';

import { ConnectToPeer } from '@components/WebRtcStarRegistration/ConnectToPeer';
import { CompletionStepsModal } from '@components/WebRtcStarRegistration/CompletionStepsModal';
import { PeerList } from '@components/WebRtcStarRegistration/PeerList';
import { pipe } from 'it-pipe';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { peerIdFromString } from '@libp2p/peer-id';

// evt.detail.remoteAddr.toJSON()
// '/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'

export const Connection = () => {
	const [localState, setLocalState] = useLocalStorage();
	const [libp2pInstance, setLibp2pInstance] = React.useState<Libp2p>();
	const [peerId, setPeerId] = React.useState<PeerId | null>(null);
	const [peerAddrs, setPeerAddrs] = React.useState<Multiaddr[]>([]);
	const [connecting, setConnecting] = React.useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [connStream, setConnStream] = React.useState<any>();

	const setConnectToPeerInfo = async (
		e: React.MouseEvent<HTMLElement>,
		peerId: string,
		multiaddress: MultiaddrInput,
		signature: string
	) => {
		e.preventDefault();
		setConnecting(false);

		try {
			const connPeerId = peerIdFromString(peerId);
			const connAddr = multiaddr(multiaddress);

			setLocalState({
				connectToPeer: connPeerId,
				connectToPeerAddrs: connAddr!,
			});

			// await libP2p!.peerStore.addressBook.set(connPeerId, [connAddr]);
			let stream;
			try {
				stream = await libp2pInstance!.dialProtocol(connPeerId, ['/p2p-swr']);
			} catch (error: any) {
				error?.errors;
			}
			setConnStream(stream);
			console.log(stream);
			console.log(connStream);

			setConnecting(true);
			const record = await libp2pInstance!.peerStore.addressBook.getPeerRecord(connPeerId);

			await pipe([uint8ArrayFromString(signature)], connStream, async (source: any) => {
				for await (const message of source) {
					debugger;
					console.log('received message', uint8ArrayToString(message));
				}
			});
		} catch (error) {
			// setConnecting(false);
			console.log(error);
		}
	};

	useEffect(() => {
		const start = async () => {
			const { libp2p, peerId, multiaddresses } = await startLibp2p();

			setLibp2pInstance(libp2p);
			setPeerId(peerId);
			setPeerAddrs(multiaddresses);

			setLocalState({
				peerId: libp2p.peerId,
				peerAddrs: multiaddresses,
			});

			// attach to window for api access in dev
			if (process.env.NODE_ENV === 'development') {
				window.libp2p = libp2p;
			}
		};

		start();

		return () => {
			libp2pInstance?.stop();
		};
	}, []);

	return (
		<DappLayout
			heading="Peer to Peer Relay"
			subHeading="sign with one wallet, have your peer pay for you."
		>
			<Flex flexDirection="column" justifyContent="center" textAlign="center" mt={3}>
				<Box mb={5}>
					<Text>Your Peer ID is:</Text>
					<Text fontWeight="bold" fontSize="20px">
						{localState.peerId?.toString()}
					</Text>
				</Box>
				<Box>
					<Text>Your Connection Address is:</Text>
					<Text fontWeight="bold" fontSize="20px">
						{localState.peerAddrs?.[0]?.toString()}
					</Text>
				</Box>
			</Flex>
			<Flex mt={3} mb={10} p={5} gap={5}>
				{libp2pInstance && localState.connectToPeer && (
					<PeerList
						connecting={connecting}
						libp2p={libp2pInstance!}
						peerId={localState?.connectToPeer}
						multiaddress={localState?.connectToPeerAddrs}
					/>
				)}
				{localState.step === P2PRelaySteps.ConnectToPeer && (
					<ConnectToPeer setConnectToPeerInfo={setConnectToPeerInfo} />
				)}
				{/* {localState.step === P2PRelaySteps.AcknowledgeAndPay && <AcknowledgeAndPay />}
				{localState.step === P2PRelaySteps.SendToPeerFirst && <SendToPeerFirst />}
				{localState.step === P2PRelaySteps.WaitForPeerInitPay && <WaitForPeerInitPay />}
				{localState.step === P2PRelaySteps.GracePeriod && <GracePeriod />}
				{localState.step === P2PRelaySteps.SignRegister && <SignRegister />}
				{localState.step === P2PRelaySteps.SendToPeerSecond && <SendToPeerSecond />}
				{localState.step === P2PRelaySteps.WaitForPeerRegisterPay && <WaitForPeerRegisterPay />} */}
				{<CompletionStepsModal isOpen={isOpen} onClose={onClose} />}
			</Flex>
		</DappLayout>
	);
};

export default Connection;
