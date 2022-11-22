import { Flex, useDisclosure, Box, useMediaQuery, Center } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import useLocalStorage, {
	accessLocalStorage,
	setLocalStorage,
	StateConfig,
} from '@hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';

import { Libp2p } from 'libp2p';

import { ProtcolHandlers, PROTOCOLS, passStreamData, startLibP2PNode } from '@utils/libp2p';

import { pipe } from 'it-pipe';
import { Stream } from '@libp2p/interface-connection';
import { useAccount } from 'wagmi';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import * as lp from 'it-length-prefixed';
import map from 'it-map';
import RegistereeContainer from '@components/WebRtcStarRegistration/containers/RegistereeContainer';
import { setLocalStorageProps, setSignatureLocalStorage } from '@utils/signature';
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';
import RelayerContainer from '@components/WebRtcStarRegistration/containers/RelayerContainer';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';

// evt.detail.remoteAddr.toJSON()
// '/dns4/am6.bootstrap.libp2p.io/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'

interface RelayerMessageProps {
	success: boolean;
	message: string;
}

interface RelayerCallbackProps {
	success: boolean;
	message: string;
	step: P2PRegistereeSteps;
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

	const [isSmallerThan1000] = useMediaQuery('(max-width: 1200px)', {
		ssr: true,
		fallback: false, // return false on the server, and re-evaluate on the client side
	});

	const handleRelayerCallback = ({ success, message, step }: RelayerCallbackProps) => {
		if (success) {
			setLocalStorage({ step });
			setRegistereeStep(step);
			console.log(message);
		} else {
			console.log(message);
			throw new Error(message);
		}
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

				// Output the data as a utf8 string
				for await (const msg of source) {
					data += msg;
				}

				const parsedData: RelayerMessageProps = JSON.parse(data);

				switch (stream.stat.protocol) {
					case PROTOCOLS.CONNECT:
						handleRelayerCallback({ ...parsedData, step: P2PRegistereeSteps.AcknowledgeAndSign });
						setLocalStorage({
							connectedToPeer: true,
							step: P2PRegistereeSteps.AcknowledgeAndSign,
						});
						break;
					case PROTOCOLS.ACK_REC:
						handleRelayerCallback({
							...parsedData,
							step: P2PRegistereeSteps.WaitForAcknowledgementPayment,
						});

						break;
					case PROTOCOLS.ACK_PAY:
						handleRelayerCallback({ ...parsedData, step: P2PRegistereeSteps.GracePeriod });

						break;
					case PROTOCOLS.REG_REC:
						handleRelayerCallback({
							...parsedData,
							step: P2PRegistereeSteps.WaitForRegistrationPayment,
						});

						break;
					case PROTOCOLS.REG_PAY:
						handleRelayerCallback({ ...parsedData, step: P2PRegistereeSteps.Success });
						break;
					default:
						console.log(`recieved unknown protocol: ${stream.stat.protocol}`);
						console.log(data);
						throw new Error(
							`recieved unknown protocol: ${stream.stat.protocol}\n and data: ${data}`
						);
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

				const parsedData: Partial<StateConfig> | setLocalStorageProps = JSON.parse(data);

				switch (stream.stat.protocol) {
					case PROTOCOLS.CONNECT:
						const newState = {
							...accessLocalStorage(),
							...parsedData,
							connectedToPeer: true,
							step: P2PRelayerSteps.WaitForAcknowledgementSign,
						};

						setLocalStorage(newState);

						// TODO - resolve window.libp2p for libp2p instance
						await passStreamData({
							libp2p: window.libp2p,
							localState: newState,
							protocol: PROTOCOLS.CONNECT,
							streamData: JSON.stringify({ success: true, message: 'connected to relayer' }),
						});

						setRealyerStep(P2PRelayerSteps.WaitForAcknowledgementSign);

						break;
					case PROTOCOLS.ACK_SIG:
						setSignatureLocalStorage(parsedData as setLocalStorageProps);

						setLocalStorage({
							trustedRelayerFor: parsedData.address,
							step: P2PRelayerSteps.AcknowledgementPayment,
						});

						// TODO - resolve window.libp2p for libp2p instance
						await passStreamData({
							libp2p: window.libp2p,
							localState: accessLocalStorage(),
							protocol: PROTOCOLS.ACK_REC,
							streamData: JSON.stringify({ success: true, message: 'connected to relayer' }),
						});

						setRealyerStep(P2PRelayerSteps.AcknowledgementPayment);
						break;
					case PROTOCOLS.REG_SIG:
						setSignatureLocalStorage(parsedData as setLocalStorageProps);

						// TODO - resolve window.libp2p for libp2p instance
						await passStreamData({
							libp2p: window.libp2p,
							localState: accessLocalStorage(),
							protocol: PROTOCOLS.REG_REC,
							streamData: JSON.stringify({ success: true, message: 'connected to relayer' }),
						});

						setRealyerStep(P2PRelayerSteps.RegistrationPayment);
						break;
					default:
						console.log(`recieved unknown protocol: ${stream.stat.protocol}`);
						console.log(data);
						throw new Error(
							`recieved unknown protocol: ${stream.stat.protocol}\n and data: ${data}`
						);
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
					{ protocol: PROTOCOLS.ACK_REC, streamHandler },
					{ protocol: PROTOCOLS.ACK_PAY, streamHandler },
					{ protocol: PROTOCOLS.REG_REC, streamHandler },
					{ protocol: PROTOCOLS.REG_PAY, streamHandler },
				];

				instance = await startLibP2PNode(protocolHandlers);
			} else {
				const streamHandler = { handler: relayHandler, options: {} };

				const protocolHandlers: ProtcolHandlers[] = [
					{ protocol: PROTOCOLS.CONNECT, streamHandler },
					{ protocol: PROTOCOLS.ACK_SIG, streamHandler },
					{ protocol: PROTOCOLS.REG_SIG, streamHandler },
				];

				instance = await startLibP2PNode(protocolHandlers);
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

	console.log(isSmallerThan1000);
	return (
		<DappLayout
			isOpen={nftDisclosure.isOpen}
			onClose={nftDisclosure.onClose}
			heading="Peer to Peer Relay"
			subHeading="sign with one wallet, have your peer pay for you."
		>
			<Center mt={5}>
				<CompletionSteps />
			</Center>
			<Flex
				mt={3}
				mb={10}
				p={5}
				gap={5}
				flexDirection={isSmallerThan1000 ? 'column' : 'row'}
				justifyContent="center"
				alignItems="center"
			>
				{localState.isRegistering && registereeStep && (
					<RegistereeContainer
						step={registereeStep}
						libp2p={libp2pInstance}
						address={address!}
						onOpen={nftDisclosure.onOpen}
						setStep={setRegistereeStep}
					/>
				)}

				{!localState.isRegistering && relayerStep && (
					<RelayerContainer
						step={relayerStep}
						libp2p={libp2pInstance}
						address={address!}
						onOpen={nftDisclosure.onOpen}
						setStep={setRealyerStep}
					/>
				)}
			</Flex>
		</DappLayout>
	);
};

export default Connection;
