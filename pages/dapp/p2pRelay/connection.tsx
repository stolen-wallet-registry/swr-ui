import { Text, Flex, useDisclosure, Box, Button, useMediaQuery } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import useLocalStorage, {
	accessLocalStorage,
	setLocalStorage,
	StateConfig,
} from '@hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';

import { Libp2p } from 'libp2p';
import { PeerId } from '@libp2p/interface-peer-id';
import { Multiaddr, multiaddr, MultiaddrInput } from '@multiformats/multiaddr';

import {
	listenerLibp2p,
	dialerLibp2p,
	ProtcolHandlers,
	PROTOCOLS,
	relayerPostBackMsg,
} from '@utils/libp2p';

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
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';
import RelayerContainer from '@components/WebRtcStarRegistration/containers/RelayerContainer';

// evt.detail.remoteAddr.toJSON()
// '/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'

interface RelayerMessageProps {
	success: boolean;
	message: string;
}

export const Connection = () => {
	const [localState, setLocalState] = useLocalStorage();
	const [libp2pInstance, setLibp2pInstance] = useState<Libp2p>();
	const { address } = useAccount();
	const completionDisclosure = useDisclosure();
	const nftDisclosure = useDisclosure();
	const [registereeStep, setRegistereeStep] = useState<P2PRegistereeSteps>(
		P2PRegistereeSteps.ConnectToPeer
	);
	const [relayerStep, setRealyerStep] = useState<P2PRelayerSteps>(
		P2PRelayerSteps.WaitForConnection
	);

	const [isLargerThan600] = useMediaQuery('(min-width: 600px)', {
		ssr: true,
		fallback: false, // return false on the server, and re-evaluate on the client side
	});

	const PeerDisplay = () => {
		return (
			<Flex flexDirection="column" justifyContent="center" textAlign="center" mt={3}>
				{localState.connectedToPeer ? (
					<Text as="h4" fontWeight="bold">
						Connected to {localState.connectToPeer?.toString()}
					</Text>
				) : (
					<Text as="h4" fontWeight="bold">
						...Waiting for Connection
					</Text>
				)}
				<Box mb={5}>
					<Text>Your Peer ID is:</Text>
					<Text fontWeight="bold" fontSize="20px">
						{localState.peerId}
					</Text>
				</Box>
				<Box>
					<Text>Your Connection Address is:</Text>
					<Text fontWeight="bold" fontSize="20px">
						{localState.peerAddrs}
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

		const connPeerId = peerIdFromString(peerId);
		const connAddr = multiaddr(multiaddress);

		setLocalState({
			connectToPeer: connPeerId.toString(),
			connectToPeerAddrs: connAddr!.toString(),
		});
	};

	const registerHandler = async ({ stream }: { stream: Stream }) => {
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
				switch (protocol) {
					case PROTOCOLS.CONNECT:
						const connect: RelayerMessageProps = JSON.parse(data);
						if (connect.success) {
							setLocalStorage({
								connectedToPeer: true,
								step: P2PRegistereeSteps.AcknowledgeAndSign,
							});
							setRegistereeStep(P2PRegistereeSteps.AcknowledgeAndSign);
							console.log(connect.message);
						} else {
							console.log(connect.message);
							throw new Error(connect.message);
						}
						break;
					case PROTOCOLS.ACK_REC:
						const message: RelayerMessageProps = JSON.parse(data);
						if (message.success) {
							setLocalStorage({
								step: P2PRegistereeSteps.WaitForAcknowledgementPayment,
							});
						} else {
							console.log(message.message);
							throw new Error(message.message);
						}
						break;
					case PROTOCOLS.ACK_PAY:
						const ackowledgePay: RelayerMessageProps = JSON.parse(data);

						if (ackowledgePay.success) {
							setLocalStorage({ step: P2PRegistereeSteps.GracePeriod });
							setRegistereeStep(P2PRegistereeSteps.GracePeriod);
							console.log(ackowledgePay.message);
						} else {
							console.log(ackowledgePay.message);
							throw new Error(ackowledgePay.message);
						}
						break;
					case PROTOCOLS.REG_REC:
						const m: RelayerMessageProps = JSON.parse(data);
						if (m.success) {
							setLocalStorage({
								step: P2PRegistereeSteps.WaitForRegistrationPayment,
							});
						} else {
							console.log(m.message);
							throw new Error(m.message);
						}
						break;
					case PROTOCOLS.REG_PAY:
						const registerPay: RelayerMessageProps = JSON.parse(data);
						if (registerPay.success) {
							setLocalStorage({ step: P2PRegistereeSteps.Success });
							setRegistereeStep(P2PRegistereeSteps.Success);
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

				switch (protocol) {
					case PROTOCOLS.CONNECT:
						const relayerState: Partial<StateConfig> = JSON.parse(data);

						setRealyerStep(P2PRelayerSteps.WaitForAcknowledgementSign);
						const newState = {
							...localState,
							...relayerState,
							connectedToPeer: true,
							step: P2PRelayerSteps.WaitForAcknowledgementSign,
						};

						setLocalStorage(newState);
						console.log(localState);
						console.log(`recieved relayer state: ${JSON.stringify(relayerState)}`);

						await relayerPostBackMsg({
							libp2p: window.libp2p,
							localState: newState,
							protocol: PROTOCOLS.CONNECT,
						});
						break;
					case PROTOCOLS.ACK_SIG:
						const acknowledgementSignature: setLocalStorageProps = JSON.parse(data);
						setSignatureLocalStorage(acknowledgementSignature);
						setLocalStorage({
							trustedRelayerFor: acknowledgementSignature.address,
							step: P2PRelayerSteps.AcknowledgementPayment,
						});
						setRealyerStep(P2PRelayerSteps.AcknowledgementPayment);
						console.log(
							`recieved acknowledgement signature: ${JSON.stringify(acknowledgementSignature)}`
						);
						// await relayerPostBackMsg({
						// 	libp2p: window.libp2p,
						// 	localState: accessLocalStorage(),
						// 	protocol: PROTOCOLS.ACK_REC,
						// });
						break;
					case PROTOCOLS.REG_SIG:
						const registerSignature: setLocalStorageProps = JSON.parse(data);
						setSignatureLocalStorage(registerSignature);
						console.log(`recieved register signature: ${JSON.stringify(registerSignature)}`);

						await relayerPostBackMsg({
							libp2p: window.libp2p,
							localState: accessLocalStorage(),
							protocol: PROTOCOLS.REG_REC,
						});
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

			setLocalState({
				peerId: peerId.toString(),
				peerAddrs: multiaddresses.map((m) => m.toString())[0],
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
			{/* <Button onClick={completionDisclosure.onOpen}>Open CompletionSteps</Button> */}
			{localState.peerId && <PeerDisplay />}
			<Flex
				flexDirection={isLargerThan600 ? 'column' : 'row'}
				mt={3}
				mb={10}
				p={5}
				gap={5}
				justifyContent="center"
			>
				{localState.isRegistering && registereeStep && (
					<RegistereeContainer
						step={registereeStep}
						libp2p={libp2pInstance}
						address={address!}
						onOpen={nftDisclosure.onOpen}
					/>
				)}

				{!localState.isRegistering && relayerStep && (
					<RelayerContainer
						step={relayerStep}
						libp2p={libp2pInstance}
						address={address!}
						onOpen={nftDisclosure.onOpen}
					/>
				)}

				{/* <CompletionStepsModal
					isOpen={completionDisclosure.isOpen}
					onClose={completionDisclosure.onClose}
				/> */}
			</Flex>
		</DappLayout>
	);
};

export default Connection;
