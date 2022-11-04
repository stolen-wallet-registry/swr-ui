import { Text, Flex, useDisclosure, Box } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRelaySteps } from '@utils/types';
import React, { useEffect } from 'react';

import { createLibp2p, Libp2p } from 'libp2p';
import { PeerId } from '@libp2p/interface-peer-id';
import { peerIdFromString } from '@libp2p/peer-id';
import { Multiaddr, multiaddr } from '@multiformats/multiaddr';
import { webSockets } from '@libp2p/websockets';
import { webRTCStar } from '@libp2p/webrtc-star';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { bootstrap } from '@libp2p/bootstrap';
import { pipe } from 'it-pipe';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';

import { ConnectToPeer } from '@components/WebRtcStarRegistration/ConnectToPeer';
import { CompletionStepsModal } from '@components/WebRtcStarRegistration/CompletionStepsModal';
import { PeerList } from '@components/WebRtcStarRegistration/PeerList';

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

	useEffect(() => {
		const startLibp2p = async () => {
			const wrtcStar = webRTCStar();

			// Create our libp2p node
			const libp2p = await createLibp2p({
				addresses: {
					// Add the signaling server address, along with our PeerId to our multiaddrs list
					// libp2p will automatically attempt to dial to the signaling server so that it can
					// receive inbound connections from other peers
					listen: [
						'/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
						'/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
					],
				},
				transports: [webSockets(), wrtcStar.transport],
				connectionEncryption: [noise()],
				streamMuxers: [mplex()],
				peerDiscovery: [
					wrtcStar.discovery,
					bootstrap({
						list: [
							'/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
							'/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
							'/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
							'/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
							'/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
						],
					}),
				],
			});

			// libp2p.addEventListener('peer:discovery', (evt) => {
			// 	const peer = evt.detail;
			// 	console.info(`Found peer ${peer.id.toString()}`);

			// 	// dial them when we discover them
			// 	if (localState.connectToPeer === evt.detail.id.toString()) {
			// 		libp2p.dial(evt.detail.id).catch((err) => {
			// 			console.info(`Could not dial ${evt.detail.id}`, err);
			// 		});
			// 	}
			// 	// libp2p.dial(evt.detail.id).catch((err) => {
			// 	// 	console.info(`Could not dial ${evt.detail.id}`, err);
			// 	// });
			// });

			libp2p.connectionManager.addEventListener('peer:connect', (evt) => {
				if (localState.connectToPeer === evt.detail.id.toString()) {
					debugger;
					const connection = evt.detail;
					console.info(`Connected to ${connection.remotePeer.toString()}`);
				}
			});

			// Listen for peers disconnecting
			libp2p.connectionManager.addEventListener('peer:disconnect', (evt) => {
				if (localState.connectToPeer === evt.detail.id.toString()) {
					debugger;
					const connection = evt.detail;
					console.info(`Disconnected from ${connection.remotePeer.toString()}`);
				}
			});

			libp2p.handle('/p2p-swr', ({ stream }) => {
				debugger;
				pipe(stream, async function (source) {
					try {
						for await (const msg of source) {
							console.log(uint8ArrayToString(msg.subarray()));
						}
					} catch (e) {
						debugger;
					}
				}).finally(() => {
					// clean up resources
					stream.close();
				});
			});

			await libp2p.start();
			const multiaddresses = await libp2p.getMultiaddrs();
			setLocalState({
				peerId: libp2p.peerId,
				peerAddrs: multiaddresses,
			});
			setPeerId(await libp2p.peerId);
			setLibp2pInstance(libp2p);
			console.info('libp2p started');
			window.libp2p = libp2p;
		};

		startLibp2p();
	}, []);

	const setConnectToPeerInfo = async (
		e: React.MouseEvent<HTMLElement>,
		peerId: string,
		multiaddress: string
	) => {
		e.preventDefault();

		setLocalState({
			connectToPeer: peerId,
			connectToPeerAddrs: multiaddress!,
		});

		setConnecting(true);

		try {
			const connAddr = multiaddr(multiaddress);
			const connPeerId = peerIdFromString(peerId);

			await libp2pInstance!.peerStore.addressBook.set(connPeerId, [connAddr]);
			let stream;
			try {
				stream = await libp2pInstance!.dialProtocol(connPeerId, ['/p2p-swr']);
			} catch (error) {
				error.errors;
				debugger;
			}
			debugger;
			setConnStream(stream);
			console.log(stream);
			console.log(connStream);

			// await pipe(
			//   [uint8ArrayFromString('protocol (a)')],
			//   stream1
			// )

			debugger;
		} catch (error) {
			setConnecting(false);
			console.log(error);
		}
	};

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
				{libp2pInstance && <PeerList connecting={connecting} libp2p={libp2pInstance!} />}
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
