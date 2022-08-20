import { Dispatch, SetStateAction } from 'react';

type StandardSteps = 'requirements' | 'acknowledge-and-pay' | 'grace-period' | 'register-and-pay';

export interface RegistrationStateManagemenetProps {
	setShowStep: (step: any) => void;
}
