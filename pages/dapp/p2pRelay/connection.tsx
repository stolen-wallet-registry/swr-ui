import { Text, Flex, useDisclosure, Box, Button } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRelaySteps } from '@utils/types';
import React, { useEffect } from 'react';

import { Libp2p } from 'libp2p';
import { PeerId } from '@libp2p/interface-peer-id';
import { Multiaddr, multiaddr, MultiaddrInput } from '@multiformats/multiaddr';

import { listenerLibp2p, dialerLibp2p, ProtcolHandlers } from '@utils/libp2p';

import { ConnectToPeer } from '@components/WebRtcStarRegistration/ConnectToPeer';
import { CompletionStepsModal } from '@components/WebRtcStarRegistration/CompletionStepsModal';
import { PeerList } from '@components/WebRtcStarRegistration/PeerList';
import { pipe } from 'it-pipe';
import { peerIdFromString } from '@libp2p/peer-id';
import { MplexStream } from '@libp2p/mplex/dist/src/mplex';
import P2pAcknowledgement from '@components/WebRtcStarRegistration/P2pAcknowledgement';
import { Stream } from '@libp2p/interface-connection';
import { useAccount } from 'wagmi';
import AcknowledgementPeerPayment from '@components/WebRtcStarRegistration/AcknowledgementPeerPayment';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import * as lp from 'it-length-prefixed';
import map from 'it-map';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';

// evt.detail.remoteAddr.toJSON()
// '/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'

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
				{isConnected ? <Text>Connected</Text> : <Text>...Waiting for Connection</Text>}
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

	const sendConnectMessage = async () => {
		try {
			if (localState.isRegistering) {
				const result = await libp2pInstance!.peerStore.addressBook.set(localState.connectToPeer!, [
					localState.connectToPeerAddrs!,
				]);
				let stream: Stream | undefined;

				setConnecting(true);

				stream = await libp2pInstance!.dialProtocol(localState.connectToPeer!, [
					'/swr/connected/1.0.0',
				]);

				setConnStream(stream);

				const relayerState = {
					isRegistering: !localState.isRegistering,
					network: localState.network,
					includeWalletNFT: localState.includeWalletNFT,
					includeSupportNFT: localState.includeSupportNFT,
				};

				await pipe(
					// Read relayerState to stream (the source)
					JSON.stringify(relayerState),
					// Turn strings into buffers
					(source) => map(source, (string) => uint8ArrayFromString(string)),
					// Encode with length prefix (so receiving side knows how much data is coming)
					lp.encode(),
					// Write to the stream (the sink)
					connStream!.sink
				);
				setIsConnected(true);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setConnecting(false);
		}
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
			connectToPeer: connPeerId,
			connectToPeerAddrs: connAddr!,
		});

		if (localState.isRegistering) {
			await sendConnectMessage();
		} else {
			setConnecting(false);
			setIsConnected(true);
		}
	};

	// - /swr/acknowledgement/signature/1.0.0: # pass acknowledgement signature
	//   - listener: relayer
	//   - dialer: registrar

	// - /swr/ackowledgement/payment/1.0.0: # pass successful payment acknowledgement
	//   - listener: registrar
	//   - dialer: relayer

	// - /swr/register/signature/1.0.0: # pass register signature
	//   - listener: relayer
	//   - dialer: registrar

	// - /swr/ackowledgement/payment/1.0.0: # pass successful payment register
	//   - listener: registrar
	//   - dialer: relayer

	// - /swr/connected/1.0.0: # pass localState
	//   - listener: relayer
	//   - dialer: registrar
	const connectHandler = async ({ stream }: { stream: Stream }) => {
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
				console.log(data);
				debugger;
				setLocalState(JSON.parse(data));
			}
		);
	};

	useEffect(() => {
		const start = async () => {
			let instance;

			if (localState.isRegistering) {
				// const protocolHandlers = [{ protocol: '/swr/connected/1.0.0', handler: connectHandler }];
				instance = await dialerLibp2p([]);
			} else {
				const protocolHandlers: ProtcolHandlers[] = [
					{ protocol: '/swr/connected/1.0.0', handlerFn: { handler: connectHandler, options: {} } },
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
				{localState.step === P2PRelaySteps.AcknowledgeAndSign && (
					<P2pAcknowledgement
						address={address!}
						onOpen={nftDisclosure.onOpen}
						setNextStep={() => setLocalState({ step: P2PRelaySteps.AcknowledgementPeerPayment })}
					/>
				)}
				{localState.step === P2PRelaySteps.AcknowledgementPeerPayment && (
					<AcknowledgementPeerPayment />
				)}
				{/*
        {localState.step === P2PRelaySteps.GracePeriod && (
					<GracePeriod setLocalState={} nextStep={} address={''} chainId={0} keyRef={''} />
				)}
				{localState.step === P2PRelaySteps.RegisterAndSign && <RegisterAndSign />}
				{localState.step === P2PRelaySteps.RegisterPeerPayment && <RegisterPeerPayment />}
        */}
				{
					<CompletionStepsModal
						isOpen={completionDisclosure.isOpen}
						onClose={completionDisclosure.onClose}
					/>
				}
			</Flex>
		</DappLayout>
	);
};

export default Connection;
