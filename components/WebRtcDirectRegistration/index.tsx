import React from 'react';

interface SelfRelayRegistrationInterface {
	onOpen: () => void;
}

const WebRtcDirectRelay: React.FC<SelfRelayRegistrationInterface> = ({ onOpen }) => {
	return <div>webrtc-direct</div>;
};

export default WebRtcDirectRelay;
