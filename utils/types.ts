export type RegistrationSectionRoutes = 'standard' | 'selfRelay' | 'p2pRelay';
export type StandardSteps =
	| 'requirements'
	| 'acknowledge-and-pay'
	| 'grace-period'
	| 'register-and-pay';
export type SelfRelaySteps =
	| 'requirements'
	| 'acknowledge'
	| 'switch-and-pay'
	| 'grace-period'
	| 'register-sign'
	| 'switch-and-pay';
export type P2PRelaySteps =
	| 'requirements'
	| 'connect-to-peer'
	| 'acknowledge'
	| 'send-to-peer'
	| 'wait-for-peer-init-pay'
	| 'grace-period'
	| 'sign-register'
	| 'send-to-peer'
	| 'wait-for-peer-register-pay';
