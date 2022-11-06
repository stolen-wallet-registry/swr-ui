import { sigServer } from '@libp2p/webrtc-star-signalling-server';

const main = async () => {
	try {
		const s = sigServer({
			port: 24642,
			host: '0.0.0.0',
			metrics: false,
		});

		console.log(s);
	} catch (e) {
		console.log(e);
	}
};

main();
