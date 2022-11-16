import { Text, Flex, useDisclosure, Box, Button, useMediaQuery, Center } from '@chakra-ui/react';
import DappLayout from '@components/DappLayout';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import useLocalStorage, {
	accessLocalStorage,
	setLocalStorage,
	StateConfig,
} from '@hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';

import { Libp2p } from 'libp2p';

import {
	listenerLibp2p,
	dialerLibp2p,
	ProtcolHandlers,
	PROTOCOLS,
	relayerPostBackMsg,
} from '@utils/libp2p';

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

	const [isLargerThan600] = useMediaQuery('(min-width: 600px)', {
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
				for await (const msg of source) {
					// Output the data as a utf8 string
					data += msg;
				}

				const protocol = stream.stat.protocol;

				switch (protocol) {
					case PROTOCOLS.CONNECT:
						const connect: RelayerMessageProps = JSON.parse(data);
						handleRelayerCallback({ ...connect, step: P2PRegistereeSteps.AcknowledgeAndSign });
						setLocalStorage({
							connectedToPeer: true,
							step: P2PRegistereeSteps.AcknowledgeAndSign,
						});
						break;
					case PROTOCOLS.ACK_REC:
						const message: RelayerMessageProps = JSON.parse(data);
						handleRelayerCallback({
							...message,
							step: P2PRegistereeSteps.WaitForAcknowledgementPayment,
						});
						break;
					case PROTOCOLS.ACK_PAY:
						const ackowledgePay: RelayerMessageProps = JSON.parse(data);
						handleRelayerCallback({ ...ackowledgePay, step: P2PRegistereeSteps.GracePeriod });
						break;
					case PROTOCOLS.REG_REC:
						const registerReceived: RelayerMessageProps = JSON.parse(data);
						handleRelayerCallback({
							...registerReceived,
							step: P2PRegistereeSteps.WaitForRegistrationPayment,
						});
						break;
					case PROTOCOLS.REG_PAY:
						const registerPay: RelayerMessageProps = JSON.parse(data);
						handleRelayerCallback({ ...registerPay, step: P2PRegistereeSteps.GracePeriod });
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

						const newState = {
							...localState,
							...relayerState,
							connectedToPeer: true,
							step: P2PRelayerSteps.WaitForAcknowledgementSign,
						};

						setLocalStorage(newState);

						// prettier-ignore
						console.log(`recieved relayer state: ${JSON.stringify(relayerState)}`);

						// TODO - resolve window.libp2p for libp2p instance
						await relayerPostBackMsg({
							libp2p: window.libp2p,
							localState: newState,
							protocol: PROTOCOLS.CONNECT,
						});

						setRealyerStep(P2PRelayerSteps.WaitForAcknowledgementSign);
						break;
					case PROTOCOLS.ACK_SIG:
						const acknowledgementSignature: setLocalStorageProps = JSON.parse(data);
						setSignatureLocalStorage(acknowledgementSignature);

						setLocalStorage({
							trustedRelayerFor: acknowledgementSignature.address,
							step: P2PRelayerSteps.AcknowledgementPayment,
						});

						// prettier-ignore
						console.log(`recieved acknowledgement signature: ${JSON.stringify(acknowledgementSignature)}`);

						// TODO - resolve window.libp2p for libp2p instance
						await relayerPostBackMsg({
							libp2p: window.libp2p,
							localState: accessLocalStorage(),
							protocol: PROTOCOLS.ACK_REC,
						});

						setRealyerStep(P2PRelayerSteps.AcknowledgementPayment);
						break;
					case PROTOCOLS.REG_SIG:
						const registerSignature: setLocalStorageProps = JSON.parse(data);
						setSignatureLocalStorage(registerSignature);

						// prettier-ignore
						console.log(`recieved register signature: ${JSON.stringify(registerSignature)}`);

						// TODO - resolve window.libp2p for libp2p instance
						await relayerPostBackMsg({
							libp2p: window.libp2p,
							localState: accessLocalStorage(),
							protocol: PROTOCOLS.REG_REC,
						});

						setRealyerStep(P2PRelayerSteps.RegistrationPayment);
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
					{ protocol: PROTOCOLS.ACK_REC, streamHandler },
					{ protocol: PROTOCOLS.REG_PAY, streamHandler },
					{ protocol: PROTOCOLS.REG_REC, streamHandler },
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
			<Flex
				flexDirection={isLargerThan600 ? 'column' : 'row'}
				mt={3}
				mb={10}
				p={5}
				gap={5}
				justifyContent="center"
			>
				<Box>
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
				</Box>
				<Center>
					<CompletionSteps />
				</Center>
			</Flex>
		</DappLayout>
	);
};

export default Connection;
