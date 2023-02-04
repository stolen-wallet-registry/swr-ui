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
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import * as lp from 'it-length-prefixed';
import map from 'it-map';

import { multiaddr, Multiaddr } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';

export const PROTOCOLS = {
	CONNECT: '/swr/connected/1.0.0',
	ACK_SIG: '/swr/acknowledgement/signature/1.0.0',
	ACK_REC: '/swr/acknowledgement/signature/1.0.0/receieved',
	ACK_PAY: '/swr/acknowledgement/payment/1.0.0',
	REG_SIG: '/swr/register/signature/1.0.0',
	REG_REC: '/swr/register/signature/receieved/1.0.0',
	REG_PAY: '/swr/register/payment/1.0.0',
};

interface LibP2PNodeInterface {
	libp2p: Libp2p;
	peerId: PeerId;
	multiaddresses: Multiaddr[];
}

export interface ProtcolHandlers {
	protocol: string;
	streamHandler: StreamHandlerRecord;
}

const startLibP2PNode = async (handlers: ProtcolHandlers[]): Promise<LibP2PNodeInterface> => {
	const wrtcStar = webRTCStar();

	// Create our libp2p node
	const libp2p = await createLibp2p({
		addresses: {
			// Add the signaling server address, along with our PeerId to our multiaddrs list
			// libp2p will automatically attempt to dial to the signaling server so that it can
			// receive inbound connections from other peers
			listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ],
		},
		transports: [webSockets(), wrtcStar.transport],
		connectionEncryption: [noise()],
		streamMuxers: [mplex()],
		peerDiscovery: [
			wrtcStar.discovery,
			bootstrap({
				list: [
					"/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
          "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
				],
			}),
		],
		nat: {
			enabled: true,
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

const passStreamData = async ({
	libp2p,
	localState,
	protocol,
	streamData,
}: {
	libp2p: Libp2p;
	localState: StateConfig;
	protocol: string;
	streamData: any;
}) => {
	const connPeerId = peerIdFromString(localState?.connectToPeer!);
	const connAddr = multiaddr(localState.connectToPeerAddrs);


	await libp2p!.peerStore.addressBook.set(connPeerId!, [connAddr]);

	let stream: Stream | undefined;

	stream = await libp2p!.dialProtocol(connAddr, [protocol]);

  console.log(streamData)
	try {
		await pipe(
			// Read signatureData to stream (the source)
			JSON.stringify(streamData),
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

export { startLibP2PNode, passStreamData };
