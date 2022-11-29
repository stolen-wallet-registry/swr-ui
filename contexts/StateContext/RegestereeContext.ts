import { createContext } from 'react';

type RegistereeContextType = {
	peerId: string | null;
	peerAddrs: string | null;
	connectToPeer: string | null;
	connectToPeerAddrs: string | null;
	connectedToPeer: boolean;
};

const RegistereeContext = createContext<RegistereeContextType>({});
