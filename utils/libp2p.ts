import { createLibp2p, Libp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { bootstrap } from '@libp2p/bootstrap';
import { mplex } from '@libp2p/mplex';
import { webRTCStar } from '@libp2p/webrtc-star';
import { webSockets } from '@libp2p/websockets';
import { pipe } from 'it-pipe';
import { PeerId } from '@libp2p/interface-peer-id';
import { StreamHandlerRecord } from '@libp2p/interface-registrar';
import { StateConfig } from '@hooks/useLocalStorage';
import { Stream } from '@libp2p/interface-connection';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import * as lp from 'it-length-prefixed';
import { createFromJSON } from '@libp2p/peer-id-factory';
import map from 'it-map';

import { multiaddr, Multiaddr, MultiaddrInput } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';

import { relayerCidJSON, registereeCidJSON } from '@utils/cids';
import { BigNumber, ethers } from 'ethers';
import { ACKNOWLEDGEMENT_KEY, REGISTRATION_KEY } from './signature';

export const PROTOCOLS = {
	CONNECT: '/swr/connected/1.0.0',
	ACK_SIG: '/swr/acknowledgement/signature/1.0.0',
	ACK_REC: '/swr/acknowledgement/signature/1.0.0/receieved',
	ACK_PAY: '/swr/acknowledgement/payment/1.0.0',
	REG_SIG: '/swr/register/signature/1.0.0',
	REG_REC: '/swr/register/signature/receieved/1.0.0',
	REG_PAY: '/swr/register/payment/1.0.0',
};

// connectionGater: {
//   denyDialPeer: (peerId: PeerId) => {
//   	if (localState?.connectToPeer?.toString() === peerId.toString()) {
//   	}
//   	return localState?.connectToPeer?.toString()
//   		? peerId.toString() !== localState?.connectToPeer?.toString()?.toString()
//   		: true;
//   },
//   denyInboundConnection: (peerId: PeerId, multiaddr: Multiaddr) => {
//   	return localState?.connectToPeer?.toString()
//   		? peerId.toString() !== localState?.connectToPeer?.toString()?.toString()
//   		: true;
//   },
//   denyOutboundConnection: (maConn: MultiaddrConnection) => {
//   	if (localState?.connectToPeerAddrs?.toString()) {
//   		return maConn.remoteAddr.toString() !== localState.connectToPeerAddrs.toString();
//   	} else {
//   		return true;
//   	}
//   },
//   filterMultiaddrForPeer: (peer: PeerId, multiaddr: Multiaddr) => {
//   	return localState?.connectToPeer?.toString()
//   		? peer.toString() !== localState?.connectToPeer?.toString()
//   		: true;
//   },
// },

interface DialerLibp2pInterface {
	libp2p: Libp2p;
	peerId: PeerId;
	multiaddresses: Multiaddr[];
}

interface ListenerLibp2pInterface extends DialerLibp2pInterface {}

export interface ProtcolHandlers {
	protocol: string;
	streamHandler: StreamHandlerRecord;
}

const dialerLibp2p = async (handlers: ProtcolHandlers[]): Promise<DialerLibp2pInterface> => {
	const wrtcStar = webRTCStar();
	const registereeCID = await createFromJSON(registereeCidJSON);

	// Create our libp2p node
	const libp2p = await createLibp2p({
		peerId: registereeCID,
		addresses: {
			// Add the signaling server address, along with our PeerId to our multiaddrs list
			// libp2p will automatically attempt to dial to the signaling server so that it can
			// receive inbound connections from other peers
			// '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
			listen: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'],
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
		nat: {
			enabled: false,
		},
		metrics: {
			enabled: true,
		},
	});

	for (let h of handlers) {
		// @ts-ignore
		const { protocol, streamHandler } = h;

		libp2p.handle(protocol, streamHandler.handler);
	}

	await libp2p.start();
	console.info('registery libp2p started');

	return {
		libp2p,
		peerId: libp2p.peerId,
		multiaddresses: libp2p.getMultiaddrs(),
	};
};

// peerStore.metadataBook.set(peerId, 'acknowledgement', uint8ArrayFromString(signature))
// const signature = peerStore.metadataBook.getValue(peerId, 'signature')
// peerStore.metadataBook.delete(peerId, 'signature')

const listenerLibp2p = async (handlers: ProtcolHandlers[]): Promise<ListenerLibp2pInterface> => {
	const wrtcStar = webRTCStar();
	const relayerCID = await createFromJSON(relayerCidJSON);

	// Create our libp2p node
	const libp2p = await createLibp2p({
		peerId: relayerCID,
		addresses: {
			// Add the signaling server address, along with our PeerId to our multiaddrs list
			// libp2p will automatically attempt to dial to the signaling server so that it can
			// receive inbound connections from other peers
			// '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
			listen: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'],
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
		nat: {
			enabled: false,
		},
		metrics: {
			enabled: true,
		},
	});

	for (let h of handlers) {
		// @ts-ignore
		const { protocol, streamHandler } = h;

		libp2p.handle(protocol, streamHandler.handler);
	}

	await libp2p.start();
	console.info('listener libp2p started');

	return {
		libp2p,
		peerId: libp2p.peerId,
		multiaddresses: libp2p.getMultiaddrs(),
	};
};

const relayerPostBackMsg = async ({
	libp2p,
	localState,
	protocol,
}: {
	libp2p: Libp2p;
	localState: StateConfig;
	protocol: string;
}) => {
	try {
		const connPeerId = peerIdFromString(localState?.connectToPeer!);
		const connAddr = multiaddr(localState.connectToPeerAddrs);

		await libp2p!.peerStore.addressBook.set(connPeerId!, [connAddr]);

		let stream: Stream | undefined;

		console.log(connPeerId, [protocol]);
		stream = await libp2p!.dialProtocol(connAddr, [protocol]);

		console.log('Sending connect message to registeree');

		await pipe(
			// Read relayerState to stream (the source)
			JSON.stringify({ success: true, message: 'connected to relayer' }),
			// Turn strings into buffers
			(source) => map(source, (string) => uint8ArrayFromString(string)),
			// Encode with length prefix (so receiving side knows how much data is coming)
			lp.encode(),
			// Write to the stream (the sink)
			stream!.sink
		);

		console.log(await stream.stat);
		await stream!.close();
		console.log(`${stream?.id} closed!`);

		return stream.stat;
	} catch (error) {
		throw error;
	}
};

const registereePassSignature = async ({
	libp2p,
	localState,
	signature,
	deadline,
	nonce,
	protocol,
}: {
	libp2p: Libp2p;
	localState: StateConfig;
	signature: string;
	deadline: BigNumber;
	nonce: BigNumber;
	protocol: string;
}) => {
	const connPeerId = peerIdFromString(localState?.connectToPeer!);
	const connAddr = multiaddr(localState.connectToPeerAddrs);

	await libp2p!.peerStore.addressBook.set(connPeerId!, [connAddr]);

	let stream: Stream | undefined;
	console.log(connPeerId, [protocol]);
	stream = await libp2p!.dialProtocol(connAddr, [protocol]);

	try {
		const signatureData = {
			value: signature,
			deadline,
			nonce,
			address: localState.address,
			chainId: localState.network,
			keyRef: protocol === PROTOCOLS.ACK_SIG ? ACKNOWLEDGEMENT_KEY : REGISTRATION_KEY,
		};

		console.log('Sending connect message to relayer');

		await pipe(
			// Read signatureData to stream (the source)
			JSON.stringify(signatureData),
			// Turn strings into buffers
			(source) => map(source, (string) => uint8ArrayFromString(string)),
			// Encode with length prefix (so receiving side knows how much data is coming)
			lp.encode(),
			// Write to the stream (the sink)
			stream!.sink
		);

		console.log(await stream.stat);
		await stream!.close();
		console.log(`${stream?.id} closed!`);

		return stream.stat;
	} catch (error) {
		throw error;
	}
};

const registereeConnectMessage = async ({
	libp2p,
	localState,
}: {
	libp2p: Libp2p;
	localState: StateConfig;
}) => {
	try {
		const connPeerId = peerIdFromString(localState?.connectToPeer!);
		const connAddr = multiaddr(localState.connectToPeerAddrs);

		await libp2p!.peerStore.addressBook.set(connPeerId!, [connAddr]);

		let stream: Stream | undefined;
		console.log(connPeerId, [PROTOCOLS.CONNECT]);
		stream = await libp2p!.dialProtocol(connAddr, [PROTOCOLS.CONNECT]);

		try {
			const relayerState = {
				network: localState.network,
				includeWalletNFT: localState.includeWalletNFT,
				includeSupportNFT: localState.includeSupportNFT,
				connectToPeer: localState?.peerId?.toString(),
				connectToPeerAddrs: localState?.peerAddrs?.toString(),
			};

			console.log('Sending connect message to relayer');

			await pipe(
				// Read relayerState to stream (the source)
				JSON.stringify(relayerState),
				// Turn strings into buffers
				(source) => map(source, (string) => uint8ArrayFromString(string)),
				// Encode with length prefix (so receiving side knows how much data is coming)
				lp.encode(),
				// Write to the stream (the sink)
				stream!.sink
			);

			console.log(await stream.stat);
			await stream!.close();
			console.log(`${stream?.id} closed!`);

			return stream.stat;
		} catch (error) {
			throw error;
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// peerStore.metadataBook.set(peerId, 'acknowledgement', uint8ArrayFromString(signature))
// const signature = peerStore.metadataBook.getValue(peerId, 'signature')
// peerStore.metadataBook.delete(peerId, 'signature')

export {
	dialerLibp2p,
	listenerLibp2p,
	registereeConnectMessage,
	relayerPostBackMsg,
	registereePassSignature,
};
