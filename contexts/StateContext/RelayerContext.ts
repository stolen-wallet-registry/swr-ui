import useLocalStorage, {
	accessLocalStorage,
	setLocalStorage,
	StateConfig,
} from '@hooks/useLocalStorage';
import { ProtcolHandlers, PROTOCOLS, passStreamData, startLibP2PNode } from '@utils/libp2p';
import { setLocalStorageProps, setSignatureLocalStorage } from '@utils/signature';
import { P2PRelayerSteps } from '@utils/types';
import { pipe } from 'it-pipe';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import * as lp from 'it-length-prefixed';
import map from 'it-map';
import React, { useState } from 'react';
import { createContext } from 'react';
import { Stream } from '@libp2p/interface-connection';
import { useAccount, useNetwork } from 'wagmi';
import { RelayerContextType } from './types';
import { useEffect } from 'react';
import { Libp2p } from 'libp2p';

const RelayerContext = createContext<RelayerContextType>({
	connectedAddress: null,
	registrationType: 'p2pRelay',
	step: P2PRelayerSteps.Instructions,
	address: undefined,
	network: undefined,
	isTrustedRelayer: null,
	trustedRelayer: null,
	trustedRelayerFor: null,
	includeWalletNFT: null,
	includeSupportNFT: null,
	includeWalletNFTAgree: null,
	includeSupportNFTAgree: null,
	isRegistering: null,
	peerId: null,
	peerAddrs: null,
	connectToPeer: null,
	connectToPeerAddrs: null,
	connectedToPeer: false,
	acknowledgementReceipt: null,
	registrationReceipt: null,
});

interface RelayerProviderProps {
	children: React.ReactNode;
}

const RelayProvider: React.FC<RelayerProviderProps> = ({ children }) => {
	const [localState, setLocalState] = useLocalStorage();
	const { address } = useAccount();
	const { chain } = useNetwork();

	const [initiateLibp2p, setInitiateLibp2p] = useState(false);
	const [libp2p, setLibp2p] = useState<Libp2p | null>(null);

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

	const startRelayerNode = async () => {
		const streamHandler = { handler: relayHandler, options: {} };

		const protocolHandlers: ProtcolHandlers[] = [
			{ protocol: PROTOCOLS.CONNECT, streamHandler },
			{ protocol: PROTOCOLS.ACK_SIG, streamHandler },
			{ protocol: PROTOCOLS.REG_SIG, streamHandler },
		];

		const node = await startLibP2PNode(protocolHandlers);

		const { libp2p, peerId, multiaddresses } = node;

		setLibp2p(libp2p);

		setLocalState({
			peerId: peerId.toString(),
			peerAddrs: multiaddresses.map((m) => m.toString())[0],
		});

		// attach to window for api access in dev
		if (process.env.NODE_ENV === 'development') {
			window.libp2p = libp2p;
		}
	};

	const context = {
		...localState,
		address,
		connectedAddress: address,
		trustedRelayer: address,
		isTrustedRelayer: true,
		isRegistering: false,
	};

	const newContext = {
		setInitiateLibp2p,
		libp2p,
		address,
		isTrustedRelayer: false,
	};

	useEffect(() => {
		if (initiateLibp2p) {
			startRelayerNode();
		}
	}, [initiateLibp2p]);

	return (
		<RelayerContext.Provider
			value={{
				...localState,
				address,
				connectedAddress: address,
				trustedRelayer: address,
				isTrustedRelayer: true,
				isRegistering: false,
			}}
		>
			{children}
		</RelayerContext.Provider>
	);
};

export default RelayProvider;
