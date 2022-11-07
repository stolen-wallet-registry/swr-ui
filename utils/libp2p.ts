import { createLibp2p, Libp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { bootstrap } from '@libp2p/bootstrap';
import { mplex } from '@libp2p/mplex';
import { webRTCStar } from '@libp2p/webrtc-star';
import { webSockets } from '@libp2p/websockets';
import { pipe } from 'it-pipe';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { Multiaddr, multiaddr } from '@multiformats/multiaddr';
import { PeerId } from '@libp2p/interface-peer-id';

// connectionGater: {
//   denyDialPeer: (peerId: PeerId) => {
//   	if (localState?.connectToPeer?.toString() === peerId.toString()) {
//   		debugger;
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

interface startLibp2pInterface {
	libp2p: Libp2p;
	peerId: PeerId;
	multiaddresses: Multiaddr[];
}

const startLibp2p = async (): Promise<startLibp2pInterface> => {
	const wrtcStar = webRTCStar();

	// Create our libp2p node
	const libp2p = await createLibp2p({
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
	});

	libp2p.handle('/p2p-swr', ({ stream }) => {
		pipe(stream, async function (source) {
			try {
				for await (const msg of source) {
					console.log(uint8ArrayToString(msg.subarray()));
				}
			} catch (e) {}
		}).finally(() => {
			// clean up resources
			stream.close();
		});
	});

	await libp2p.start();
	// setLocalState({
	// 	peerId: libp2p.peerId,
	// 	peerAddrs: multiaddresses,
	// });
	// setPeerId(await libp2p.peerId);
	// setLibp2pInstance(libp2p);
	// window.libp2p = libp2p;
	console.info('libp2p started');

	return {
		libp2p,
		peerId: libp2p.peerId,
		multiaddresses: libp2p.getMultiaddrs(),
	};
};

// peerStore.metadataBook.set(peerId, 'acknowledgement', uint8ArrayFromString(signature))
// const signature = peerStore.metadataBook.getValue(peerId, 'signature')
// peerStore.metadataBook.delete(peerId, 'signature')

export { startLibp2p };
