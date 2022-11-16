import { Flex, useMediaQuery } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';
import { Libp2p } from 'libp2p';
import React, { useEffect, useState } from 'react';
import { PeerList } from '../PeerList';
import GracePeriod from '@components/SharedRegistration/GracePeriod';

import { multiaddr, MultiaddrInput } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { registereeConnectMessage } from '@utils/libp2p';
import WaitForAcknowledgementSign from '../Relayer/WaitForAcknowledgementSign';
import WaitForConnection from '../Relayer/WaitForConnection';
import WaitForRegistrationSign from '../Relayer/WaitForRegistrationSign';
import AcknowledgementPayment from '../Relayer/AcknowledgementPayment';
import { BigNumber } from 'ethers';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { useNetwork, useSigner } from 'wagmi';

interface RelayerContainerProps {
	step: P2PRelayerSteps;
	libp2p: Libp2p;
	address: string;
	onOpen: () => void;
}

const RealyerContainer: React.FC<RelayerContainerProps> = ({ step, libp2p, address, onOpen }) => {
	const [localState, setLocalState] = useLocalStorage();
	const [connected, setIsConnected] = useState(false);
	const [status, setStatus] = useState('waiting to connect to peer.');
	const [error, setError] = useState<Error | unknown>();
	const [expirey, setExpirey] = useState<BigNumber | null>(null);
	const { data: signer } = useSigner();
	const { chain } = useNetwork();

	const [isLargerThan500] = useMediaQuery('(min-width: 500px)');

	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
		signer!
	);

	const setConnectToPeerInfo = async (
		e: React.MouseEvent<HTMLElement>,
		peerId: string,
		multiaddress: MultiaddrInput
	) => {
		e.preventDefault();
		setStatus('trying to connect...');
		try {
			const connPeerId = peerIdFromString(peerId);
			const connAddr = multiaddr(multiaddress);

			setLocalState({
				connectToPeer: connPeerId.toString(),
				connectToPeerAddrs: connAddr!.toString(),
			});
			try {
				const stat = await registereeConnectMessage({ libp2p, localState });
				console.log(stat);

				if (stat?.timeline) {
					setIsConnected(true);
				} else {
					setIsConnected(false);
				}
			} catch (error) {
				console.log(error);
				setError(error);
				setIsConnected(false);
			}
		} catch (error) {
			console.log(error);

			setStatus(`failed to connect: ${error}`);
		}
	};

	const resolveExpirey = async () => {
		const startTime = await registryContract['getStartTime(address)'](localState.address!);

		setExpirey(startTime);
	};

	useEffect(() => {
		if (step === P2PRelayerSteps.GracePeriod) {
			resolveExpirey();
		}
	}, [step]);

	return (
		<Flex
			mt={3}
			mb={10}
			p={5}
			gap={5}
			flexDirection={isLargerThan500 ? 'row' : 'column'}
			justifyContent="center"
		>
			{libp2p && (
				<>
					<PeerList
						connected={connected}
						libp2p={libp2p!}
						peerId={localState?.connectToPeer}
						multiaddress={localState?.connectToPeerAddrs}
					/>
				</>
			)}
			{step === P2PRelayerSteps.WaitForConnection && <WaitForConnection />}
			{step === P2PRelayerSteps.WaitForAcknowledgementSign && (
				<WaitForAcknowledgementSign libp2p={libp2p} localState={localState} />
			)}
			{step === P2PRelayerSteps.AcknowledgementPayment && (
				<AcknowledgementPayment libp2p={libp2p} />
			)}
			{step === P2PRelayerSteps.GracePeriod && (
				<GracePeriod
					expirey={expirey}
					setNextStep={() => setLocalState({ step: P2PRelayerSteps.WaitForRegistrationSign })}
				/>
			)}
			{step === P2PRelayerSteps.WaitForRegistrationSign && <WaitForRegistrationSign />}
		</Flex>
	);
};

export default RealyerContainer;
