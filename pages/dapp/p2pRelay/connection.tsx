import { Text, Flex, useDisclosure, Box, Button } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import React, { useEffect } from 'react';

import { Libp2p } from 'libp2p';
import { PeerId } from '@libp2p/interface-peer-id';
import { Multiaddr, multiaddr, MultiaddrInput } from '@multiformats/multiaddr';

import { listenerLibp2p, dialerLibp2p, ProtcolHandlers, PROTOCOLS } from '@utils/libp2p';

import { ConnectToPeer } from '@components/WebRtcStarRegistration/Registeree/ConnectToPeer';
import { CompletionStepsModal } from '@components/WebRtcStarRegistration/CompletionStepsModal';
import { PeerList } from '@components/WebRtcStarRegistration/PeerList';
import { pipe } from 'it-pipe';
import { peerIdFromString } from '@libp2p/peer-id';
import { MplexStream } from '@libp2p/mplex/dist/src/mplex';
import P2pAcknowledgement from '@components/WebRtcStarRegistration/Registeree/AcknowledgeAndSign';
import { Stream } from '@libp2p/interface-connection';
import { chainId, useAccount } from 'wagmi';
import AcknowledgementPeerPayment from '@components/WebRtcStarRegistration/Relayer/AcknowledgementPayment';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import * as lp from 'it-length-prefixed';
import map from 'it-map';
import RegistereeContainer from '@components/WebRtcStarRegistration/containers/RegistereeContainer';
import { setLocalStorageProps, setSignatureLocalStorage } from '@utils/signature';
import { P2PRegistereeSteps } from '@utils/types';
import RelayerContainer from '@components/WebRtcStarRegistration/containers/RelayerContainer';

// evt.detail.remoteAddr.toJSON()
// '/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'

interface RelayerMessageProps {
	success: boolean;
	message: string;
}

export const Connection = () => {
	const [localState, setLocalState] = useLocalStorage();
	const [libp2pInstance, setLibp2pInstance] = React.useState<Libp2p>();
	const { address } = useAccount();
	const [peerId, setPeerId] = React.useState<PeerId | null>(null);
	const [peerAddrs, setPeerAddrs] = React.useState<Multiaddr[]>([]);
	const [connecting, setConnecting] = React.useState(false);
	const [isConnected, setIsConnected] = React.useState(false);
	const completionDisclosure = useDisclosure();
	const nftDisclosure = useDisclosure();
	const [connStream, setConnStream] = React.useState<Stream>();

	const PeerDisplay = ({ isConnected }: { isConnected: boolean }) => {
		return (
			<Flex flexDirection="column" justifyContent="center" textAlign="center" mt={3}>
				{isConnected ? (
					<Text as="h4" fontWeight="bold">
						Connected
					</Text>
				) : (
					<Text as="h4" fontWeight="bold">
						...Waiting for Connection
					</Text>
				)}
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
		);
	};

	const setConnectToPeerInfo = async (
		e: React.MouseEvent<HTMLElement>,
		peerId: string,
		multiaddress: MultiaddrInput
	) => {
		e.preventDefault();
		setConnecting(false);

		const connPeerId = peerIdFromString(peerId);
		const connAddr = multiaddr(multiaddress);

		setLocalState({
			connectToPeer: connPeerId.toString(),
			connectToPeerAddrs: [connAddr!.toString()],
		});

		setConnecting(false);
		setIsConnected(true);
	};

	const registerHandler = async ({ stream }: { stream: Stream }) => {
		debugger;
		pipe(
			// Read from the stream (the source)
			stream.source,
			// Decode length-prefixed data
			lp.decode(),
			// Turn buffers into strings
			(source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
			async function (source) {
				// For each chunk of data
				let data = '';
				for await (const msg of source) {
					// Output the data as a utf8 string
					data += msg;
				}

				const protocol = stream.stat.protocol;
				debugger;
				switch (protocol) {
					case PROTOCOLS.CONNECT:
						const connect: RelayerMessageProps = JSON.parse(data);
						if (connect.success) {
							setLocalState({ step: P2PRegistereeSteps.AcknowledgeAndSign });
							console.log(connect.message);
						} else {
							console.log(connect.message);
							throw new Error(connect.message);
						}
						break;
					case PROTOCOLS.ACK_PAY:
						const ackowledgePay: RelayerMessageProps = JSON.parse(data);

						if (ackowledgePay.success) {
							setLocalState({ step: P2PRegistereeSteps.GracePeriod });
							console.log(ackowledgePay.message);
						} else {
							console.log(ackowledgePay.message);
							throw new Error(ackowledgePay.message);
						}
						break;
					case PROTOCOLS.REG_PAY:
						const registerPay: RelayerMessageProps = JSON.parse(data);
						if (registerPay.success) {
							setLocalState({ step: P2PRegistereeSteps.Success });
							console.log(registerPay.message);
						} else {
							console.log(registerPay.message);
							throw new Error(registerPay.message);
						}
					default:
						console.log(`recieved unknown protocol: ${protocol}`);
						console.log(data);
						throw new Error(`recieved unknown protocol: ${protocol}\n and data: ${data}`);
				}

				console.log(stream.stat);
			}
		);
	};

	const relayHandler = async ({ stream }: { stream: Stream }) => {
		debugger;
		pipe(
			// Read from the stream (the source)
			stream.source,
			// Decode length-prefixed data
			lp.decode(),
			// Turn buffers into strings
			(source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
			// Sink function
			async function (source) {
				// For each chunk of data
				let data = '';
				for await (const msg of source) {
					// Output the data as a utf8 string
					data += msg;
				}

				const protocol = stream.stat.protocol;

				debugger;
				switch (protocol) {
					case PROTOCOLS.CONNECT:
						debugger;
						const relayerState: Partial<StateConfig> = JSON.parse(data);
						setLocalState(relayerState);
						console.log(`recieved relayer state: ${JSON.stringify(relayerState)}`);
						break;
					case PROTOCOLS.ACK_SIG:
						const acknowledgementSignature: setLocalStorageProps = JSON.parse(data);
						setSignatureLocalStorage(acknowledgementSignature);
						console.log(
							`recieved acknowledgement signature: ${JSON.stringify(acknowledgementSignature)}`
						);
						break;
					case PROTOCOLS.REG_SIG:
						const registerSignature: setLocalStorageProps = JSON.parse(data);
						setSignatureLocalStorage(registerSignature);
						console.log(`recieved register signature: ${JSON.stringify(registerSignature)}`);
						break;
					default:
						console.log(`recieved unknown protocol: ${protocol}`);
						console.log(data);
						throw new Error(`recieved unknown protocol: ${protocol}\n and data: ${data}`);
				}

				console.log(stream.stat);
			}
		);
	};

	useEffect(() => {
		const start = async () => {
			let instance;

			if (localState.isRegistering) {
				const streamHandler = { handler: registerHandler, options: {} };

				const protocolHandlers: ProtcolHandlers[] = [
					{ protocol: PROTOCOLS.CONNECT, streamHandler },
					{ protocol: PROTOCOLS.ACK_PAY, streamHandler },
					{ protocol: PROTOCOLS.REG_PAY, streamHandler },
				];

				instance = await dialerLibp2p(protocolHandlers);
			} else {
				const streamHandler = { handler: relayHandler, options: {} };

				const protocolHandlers: ProtcolHandlers[] = [
					{ protocol: PROTOCOLS.CONNECT, streamHandler },
					{ protocol: PROTOCOLS.ACK_SIG, streamHandler },
					{ protocol: PROTOCOLS.REG_SIG, streamHandler },
				];

				instance = await listenerLibp2p(protocolHandlers);
			}
			const { libp2p, peerId, multiaddresses } = instance;

			setLibp2pInstance(libp2p);
			setPeerId(peerId);
			setPeerAddrs(multiaddresses);

			setLocalState({
				peerId: peerId,
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

	if (!libp2pInstance) {
		return <div>loading...</div>;
	}

	return (
		<DappLayout
			isOpen={nftDisclosure.isOpen}
			onClose={nftDisclosure.onClose}
			heading="Peer to Peer Relay"
			subHeading="sign with one wallet, have your peer pay for you."
		>
			<Button onClick={completionDisclosure.onOpen}>Open CompletionSteps</Button>
			<PeerDisplay isConnected={isConnected} />
			<Flex mt={3} mb={10} p={5} gap={5}>
				{localState.isRegistering ? (
					<RegistereeContainer
						libp2p={libp2pInstance}
						address={address!}
						onOpen={nftDisclosure.onOpen}
					/>
				) : (
					<RelayerContainer
						libp2p={libp2pInstance}
						address={address!}
						onOpen={nftDisclosure.onOpen}
					/>
				)}

				<CompletionStepsModal
					isOpen={completionDisclosure.isOpen}
					onClose={completionDisclosure.onClose}
				/>
			</Flex>
		</DappLayout>
	);
};

export default Connection;
