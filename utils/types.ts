import { off } from 'process';

export type RegistrationTypes = 'standardRelay' | 'selfRelay' | 'p2pRelay';

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
}

export enum P2PRelayerSteps {
	Instructions = 'instructions',
	WaitForConnection = 'wait-for-connection',
	WaitForAcknowledgementSign = 'wait-for-acknowledgement-sign',
	AcknowledgementPayment = 'acknowledgement-payment',
	GracePeriod = 'grace-period',
	WaitForRegistrationSign = 'wait-for-registration-sign',
	RegistrationPayment = 'registration-payment',
}

// export type StandardSteps =
// 	| 'requirements'
// 	| 'acknowledge-and-pay'
// 	| 'grace-period'
// 	| 'register-and-pay';

// export type SelfRelaySteps =
// 	| 'requirements'
// 	| 'acknowledge-and-sign'
// 	| 'switch-and-pay-one'
// 	| 'grace-period'
// 	| 'register-and-sign'
// 	| 'switch-and-pay-two';

// export type P2PRelaySteps =
// 	| 'requirements'
// 	| 'connect-to-peer'
// 	| 'acknowledge-and-pay'
// 	| 'send-to-peer'
// 	| 'wait-for-peer-init-pay'
// 	| 'grace-period'
// 	| 'sign-register'
// 	| 'send-to-peer'
// 	| 'wait-for-peer-register-pay';

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
