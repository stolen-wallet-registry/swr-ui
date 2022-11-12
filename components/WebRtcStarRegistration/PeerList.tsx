import { Text, useToast, Tooltip, UnorderedList, Heading, Flex, Button } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import React, { useEffect, useState } from 'react';
import truncate from 'lodash/truncate';
import { Multiaddr } from '@multiformats/multiaddr';

import { Libp2p } from 'libp2p';
import type { PeerId } from '@libp2p/interface-peer-id';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import useCopyToClipboard from '@hooks/useCopyToClipboard';

interface PeerListProps {
	libp2p: Libp2p;
	connected: boolean;
	peerId?: string | null;
	multiaddress?: string | null;
}

export const PeerList = ({ libp2p, connected, peerId, multiaddress }: PeerListProps) => {
	const [copyValue, setCopyValue] = useCopyToClipboard();
	const toast = useToast();

	const [localState, _] = useLocalStorage();
	const [peers, setPeers] = useState<PeerId[]>([]);

	const copyText = (subject: string, value: string) => {
		setCopyValue(value);

		toast({
			title: `copied ${subject} to clipboard`,
			status: 'success',
			duration: 7000,
			isClosable: true,
			position: 'top-right',
		});
	};

	const PeerDetails = () => {
		return (
			<Flex flexDirection="column" mb={4} gap={2} fontSize={14}>
				<Flex alignItems="center" gap={5}>
					<Text>
						Peer ID:{' '}
						<span style={{ fontWeight: 'bold' }}>
							{localState?.peerId && (
								<Tooltip
									hasArrow
									maxW={550}
									arrowSize={8}
									label={localState?.peerId}
									aria-label={localState?.peerId}
									closeDelay={500}
								>
									{localState?.peerId}
								</Tooltip>
							)}
						</span>
					</Text>
					<Button size="sm" onClick={() => copyText('PeerID', localState?.peerId || '')}>
						Copy
					</Button>
				</Flex>
				<Flex alignItems="center" gap={5}>
					<Text>
						Connection Address:{' '}
						<span style={{ fontWeight: 'bold' }}>
							{localState?.peerAddrs && (
								<Tooltip
									maxW={600}
									hasArrow
									arrowSize={8}
									label={localState?.peerAddrs}
									aria-label={localState?.peerAddrs}
									closeDelay={500}
								>
									{truncate(localState?.peerAddrs, { length: 35 })}
								</Tooltip>
							)}
						</span>
					</Text>
					<Button size="sm" onClick={() => copyText('PeerAddress', localState?.peerAddrs || '')}>
						Copy
					</Button>
				</Flex>
			</Flex>
		);
	};

	const ConnectionDetails = () => {
		return !connected ? (
			<Flex flexDirection="column" gap={3} mb={4}>
				<Text>
					connecting to PeerID:{' '}
					<span style={{ fontWeight: 'bold', fontSize: 14 }}>{peerId?.toString()}</span>
				</Text>
				<Text>
					connecting to Peer Address:{' '}
					<span style={{ fontWeight: 'bold', fontSize: 12 }}>
						{truncate(multiaddress?.toString(), { length: 35 })}
					</span>
				</Text>
			</Flex>
		) : (
			<Flex flexDirection="column" gap={2} pb={3}>
				<Text>
					connected to: <span style={{ fontWeight: 'bold' }}>{peerId?.toString()}</span>
				</Text>

				<Text>
					connected to:{' '}
					<span style={{ fontWeight: 'bold', fontSize: 12 }}>
						{truncate(multiaddress?.toString(), { length: 50 })}
					</span>
				</Text>
			</Flex>
		);
	};

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
			<PeerDetails />
			<ConnectionDetails />
			{peers.length > 0 && (
				<>
					<Heading as="h4">Trusted Peer List</Heading>
					<UnorderedList>
						{peers.map((peer: PeerId) => (
							<li key={peer.toString()}>{peer.toString()}</li>
						))}
					</UnorderedList>
				</>
			)}
		</RegistrationSection>
	);
};
