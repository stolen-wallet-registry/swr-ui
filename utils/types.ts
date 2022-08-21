export type RegistrationTypes = 'standard' | 'selfRelay' | 'p2pRelay';

export type StandardSteps =
	| 'requirements'
	| 'acknowledge-and-pay'
	| 'grace-period'
	| 'register-and-pay';

export type SelfRelaySteps =
	| 'requirements'
	| 'acknowledge-and-sign'
	| 'switch-and-pay'
	| 'grace-period'
	| 'register-and-sign'
	| 'switch-and-pay';

export type P2PRelaySteps =
	| 'requirements'
	| 'connect-to-peer'
	| 'acknowledge-and-pay'
	| 'send-to-peer'
	| 'wait-for-peer-init-pay'
	| 'grace-period'
	| 'sign-register'
	| 'send-to-peer'
	| 'wait-for-peer-register-pay';

export type PreviewMessageKey = 'default' | 'en' | 'es' | 'fr';

export type showColorProps = 'home' | 'about' | 'why' | 'how' | 'features';
