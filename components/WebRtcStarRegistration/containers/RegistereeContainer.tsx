import { Flex, useMediaQuery } from '@chakra-ui/react';
import useLocalStorage from '@hooks/useLocalStorage';
import { P2PRegistereeSteps } from '@utils/types';
import { Libp2p } from 'libp2p';
import React, { useEffect, useState } from 'react';
import { PeerList } from '../PeerList';
import { ConnectToPeer } from '../Registeree/ConnectToPeer';
import AcknowledgeAndSign from '../Registeree/AcknowledgeAndSign';
import WaitForAcknowledgementPayment from '../Registeree/WaitForAcknowledgementPayment';
import WaitForRegistrationPayment from '../Registeree/WaitForRegistrationPayment';
import RegisterAndSign from '../Registeree/RegisterAndSign';

import GracePeriod from '@components/SharedRegistration/GracePeriod';

import { multiaddr, MultiaddrInput } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { registereeConnectMessage } from '@utils/libp2p';
import { useNetwork, useSigner } from 'wagmi';
import { ACKNOWLEDGEMENT_KEY, getSignatureWithExpiry } from '@utils/signature';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { BigNumber } from 'ethers';

interface RegistreeContainerProps {
	step: P2PRegistereeSteps;
	libp2p: Libp2p;
	address: string;
	onOpen: () => void;
}

const RegistereeContainer: React.FC<RegistreeContainerProps> = ({
	step,
	libp2p,
	address,
	onOpen,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const [connected, setIsConnected] = useState(false);
	const [status, setStatus] = useState('waiting to connect to peer.');
	const [error, setError] = useState<Error | unknown>();
	const [expirey, setExpirey] = useState<BigNumber | null>(null);
	const [tempRelayer, setTempRelayer] = useState('');
	const { chain } = useNetwork();
	const { data: signer } = useSigner();
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
		if (step === P2PRegistereeSteps.GracePeriod) {
			const startTime = await registryContract['getStartTime()']();

			setExpirey(startTime);
		}
	};

	useEffect(() => {
		resolveExpirey();
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
			{libp2p && localState.connectToPeer && (
				<PeerList
					connected={connected}
					libp2p={libp2p!}
					peerId={localState?.connectToPeer}
					multiaddress={localState?.connectToPeerAddrs}
				/>
			)}
			{step === P2PRegistereeSteps.ConnectToPeer && (
				<ConnectToPeer setConnectToPeerInfo={setConnectToPeerInfo} />
			)}
			{step === P2PRegistereeSteps.AcknowledgeAndSign && (
				<AcknowledgeAndSign
					libp2p={libp2p!}
					tempRelayer={tempRelayer}
					setTempRelayer={setTempRelayer}
					address={address!}
					onOpen={onOpen}
					setNextStep={() =>
						setLocalState({ step: P2PRegistereeSteps.WaitForAcknowledgementPayment })
					}
				/>
			)}
			{step === P2PRegistereeSteps.WaitForAcknowledgementPayment && (
				<WaitForAcknowledgementPayment />
			)}
			{step === P2PRegistereeSteps.GracePeriod && (
				<GracePeriod
					expirey={expirey!}
					setNextStep={() => setLocalState({ step: P2PRegistereeSteps.RegisterAndSign })}
				/>
			)}
			{step === P2PRegistereeSteps.RegisterAndSign && (
				<RegisterAndSign
					address={address}
					onOpen={onOpen}
					setNextStep={() => setLocalState({ step: P2PRegistereeSteps.WaitForRegistrationPayment })}
				/>
			)}
			{step === P2PRegistereeSteps.WaitForRegistrationPayment && <WaitForRegistrationPayment />}
		</Flex>
	);
};

export default RegistereeContainer;
