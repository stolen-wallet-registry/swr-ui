import { Text, UnorderedList, Heading, Flex } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import React, { useEffect } from 'react';
import truncate from 'lodash/truncate';
import { Multiaddr } from '@multiformats/multiaddr';

import { Libp2p } from 'libp2p';
import type { PeerId } from '@libp2p/interface-peer-id';

interface PeerListProps {
	libp2p: Libp2p;
	connecting: boolean;
	peerId?: PeerId | null;
	multiaddress?: Multiaddr | null;
}

export const PeerList = ({ libp2p, connecting, peerId, multiaddress }: PeerListProps) => {
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
					<Text fontWeight="bold">{peerId?.toString()}</Text>
					<Text>trying to connect to:</Text>
					<Text fontWeight="bold">{truncate(multiaddress?.toString(), { length: 50 })}</Text>
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
