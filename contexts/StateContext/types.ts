import {
	P2PRegistereeSteps,
	P2PRelayerSteps,
	RegistrationTypes,
	RegistrationValues,
	SelfRelaySteps,
	StandardSteps,
} from '@utils/types';

type BaserStateConfig = {
	connectedAddress: string | null;
	registrationType: RegistrationTypes;
	step: RegistrationValues;
	address: string | undefined;
	network: number | undefined;
	includeWalletNFT: boolean | null;
	includeSupportNFT: boolean | null;
	includeWalletNFTAgree: boolean | null;
	includeSupportNFTAgree: boolean | null;
	isRegistering: boolean | null;
	isTrustedRelayer: boolean | null;
	trustedRelayer: string | null;
	acknowledgementReceipt?: string | null;
	registrationReceipt?: string | null;
};

type BaseP2PConfig = BaserStateConfig & {
	registrationType: 'p2pRelay';
	peerId: string | null;
	peerAddrs: string | null;
	connectToPeer: string | null;
	connectToPeerAddrs: string | null;
	connectedToPeer: boolean;
	// TODO remove this for isTrustedRelayer && trustedRelayer
	trustedRelayerFor: string | null;
};

export type StandardContextType = BaserStateConfig & {
	step: StandardSteps;
};

export type SelfRelayerContextType = BaserStateConfig & {
	step: SelfRelaySteps;
};

export type RelayerContextType = BaseP2PConfig & {
	step: P2PRelayerSteps;
};

export type RegistereeContextType = BaseP2PConfig & {
	step: P2PRegistereeSteps;
};
