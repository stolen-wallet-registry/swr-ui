import React from 'react';

interface SelfRelayRegistrationInterface {
	onOpen: () => void;
}

const SelfRelayRegistration: React.FC<SelfRelayRegistrationInterface> = ({ onOpen }) => {
	return <div>self relay</div>;
};

export default SelfRelayRegistration;
