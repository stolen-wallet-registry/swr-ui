export type String0x = `0x${string}` | undefined;
export type RegistrationTypes = 'standardRelay' | 'selfRelay' | 'p2pRelay';

export const registrationTitles = {
	standardRelay: 'Standard Relay',
	selfRelay: 'Self Relay',
	p2pRelay: 'P2P Relay',
};

// TODO do these need requirements?
// TODO convert enums to interger values
export enum StandardSteps {
	AcknowledgeAndPay = 'acknowledge-and-pay',
	GracePeriod = 'grace-period',
	RegisterAndPay = 'register-and-pay',
	Success = 'success',
	Expired = 'expired',
}

export enum SelfRelaySteps {
	AcknowledgeAndSign = 'acknowledge-and-sign',
	SwitchAndPayOne = 'switch-and-pay-one',
	GracePeriod = 'grace-period',
	RegisterAndSign = 'register-and-sign',
	SwitchAndPayTwo = 'switch-and-pay-two',
	Success = 'success',
	Expired = 'expired',
}

export enum P2PRegistereeSteps {
	Instructions = 'instructions',
	ConnectToPeer = 'connect-to-peer',
	AcknowledgeAndSign = 'acknowledge-and-sign',
	WaitForAcknowledgementPayment = 'wait-for-acknowledgement-payment',
	GracePeriod = 'grace-period',
	RegisterAndSign = 'register-and-sign',
	WaitForRegistrationPayment = 'wait-for-register-payment',
	Success = 'success',
	Expired = 'expired',
}

export enum P2PRelayerSteps {
	Instructions = 'instructions',
	WaitForConnection = 'wait-for-connection',
	WaitForAcknowledgementSign = 'wait-for-acknowledgement-sign',
	AcknowledgementPayment = 'acknowledgement-payment',
	GracePeriod = 'grace-period',
	WaitForRegistrationSign = 'wait-for-registration-sign',
	RegistrationPayment = 'registration-payment',
	Success = 'success',
	Expired = 'expired',
}

export const RegistrationValueMap = {
	standardRelay: StandardSteps,
	selfRelay: SelfRelaySteps,
	p2pRelay: P2PRegistereeSteps || P2PRelayerSteps,
};

// TODO add logic for RegistrationTypes against RegistrationSteps
export type RegistrationValues =
	| StandardSteps
	| SelfRelaySteps
	| P2PRegistereeSteps
	| P2PRelayerSteps;

export type PreviewMessageKey = 'default' | 'en' | 'es' | 'fr';
export type showColorProps = 'home' | 'about' | 'why' | 'how' | 'features';
