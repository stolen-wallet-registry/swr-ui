import { Text, Button, UnorderedList, Heading, Flex } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage from '@hooks/useLocalStorage';
import React, { useEffect } from 'react';
import truncate from 'lodash/truncate';

import { Libp2p } from 'libp2p';
import type { PeerId } from '@libp2p/interface-peer-id';

interface PeerListProps {
	libp2p: Libp2p;
	connecting: boolean;
}

export const PeerList = ({ libp2p, connecting }: PeerListProps) => {
	const [localState, setLocalState] = useLocalStorage();
	const [peers, setPeers] = React.useState<PeerId[]>([]);

	useEffect(() => {
		const getPeerList = async () => {
			const list = await libp2p.getPeers();

			setPeers(list);
		};

		const interval = setInterval(async () => await getPeerList(), 10000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<RegistrationSection title="Connection Details">
			{connecting && (
				<Flex flexDirection="column" gap={2}>
					<Text>trying to connect to: </Text>
					<Text fontWeight="bold">{localState.connectToPeer}</Text>
					<Text>trying to connect to:</Text>
					<Text fontWeight="bold">{truncate(localState.connectToPeerAddrs!, { length: 50 })}</Text>
				</Flex>
			)}
			<Heading as="h4">Trusted Peer List</Heading>
			<UnorderedList>
				{peers.map((peer: PeerId) => (
					<li key={peer.toString()}>{peer.toString()}</li>
				))}
			</UnorderedList>
		</RegistrationSection>
	);
};
