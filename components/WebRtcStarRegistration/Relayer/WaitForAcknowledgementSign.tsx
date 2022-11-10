import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import React, { useEffect } from 'react';
import { Libp2p } from 'libp2p';
import { relayerPostBackMsg } from '@utils/libp2p';

interface WaitForAcknowledgementSignProps {
	localState: StateConfig;
	libp2p: Libp2p;
}

const WaitForAcknowledgementSign: React.FC<WaitForAcknowledgementSignProps> = ({
	libp2p,
	localState,
}) => {
	return <div>WaitForAcknowledgementSign</div>;
};

export default WaitForAcknowledgementSign;
