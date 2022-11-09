import { Text, UnorderedList, Heading, Flex } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import React, { useEffect, useState } from 'react';
import truncate from 'lodash/truncate';
import { Multiaddr } from '@multiformats/multiaddr';

import { Libp2p } from 'libp2p';
import type { PeerId } from '@libp2p/interface-peer-id';

interface PeerListProps {
	libp2p: Libp2p;
	connected: boolean;
	peerId?: string | null;
	multiaddress?: string | null;
}

export const PeerList = ({ libp2p, connected, peerId, multiaddress }: PeerListProps) => {
	const [peers, setPeers] = useState<PeerId[]>([]);

	useEffect(() => {
		const getPeerList = async () => {
			const list = await libp2p.getPeers().filter((pid) => pid.equals(peerId!));

			setPeers(list);
		};

		const interval = setInterval(async () => await getPeerList(), 10000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<RegistrationSection title="Connection Details">
			{!connected ? (
				<Flex flexDirection="column" gap={2}>
					<Text>trying to connect to: </Text>
					<Text fontWeight="bold">{peerId?.toString()}</Text>
					<Text>trying to connect to:</Text>
					<Text fontWeight="bold" fontSize={10}>
						{truncate(multiaddress?.toString(), { length: 50 })}
					</Text>
				</Flex>
			) : (
				<Flex flexDirection="column" gap={2}>
					<Text>connected to: </Text>
					<Text fontWeight="bold">{peerId?.toString()}</Text>
					<Text>connected to:</Text>
					<Text fontWeight="bold" fontSize={10}>
						{truncate(multiaddress?.toString(), { length: 50 })}
					</Text>
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
