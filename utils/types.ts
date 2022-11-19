import { off } from 'process';

export type RegistrationTypes = 'standardRelay' | 'selfRelay' | 'p2pRelay';

// TODO do these need requirements?
export enum StandardSteps {
	AcknowledgeAndPay = 'acknowledge-and-pay',
	GracePeriod = 'grace-period',
	RegisterAndPay = 'register-and-pay',
}

export enum SelfRelaySteps {
	AcknowledgeAndSign = 'acknowledge-and-sign',
	SwitchAndPayOne = 'switch-and-pay-one',
	GracePeriod = 'grace-period',
	RegisterAndSign = 'register-and-sign',
	SwitchAndPayTwo = 'switch-and-pay-two',
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
