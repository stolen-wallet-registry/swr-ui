import { Libp2p } from 'libp2p';

export {};

declare global {
	interface Window {
		libp2p: Libp2p;
	}
}
