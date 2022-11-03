import {
	Flex,
	Spacer,
	CheckboxGroup,
	Checkbox,
	Button,
	Text,
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react';
import { AcknowledgementForm } from '@components/AcknowledgementForm';
import RegistrationSection from '@components/RegistrationSection';
import { buildAcknowledgementStruct, signTypedDataProps } from '@hooks/use712Signature';
import useDebounce from '@hooks/useDebounce';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { ACKNOWLEDGEMENT_KEY, setSignatureWithExpiry } from '@utils/signature';
import { SelfRelaySteps } from '@utils/types';
import {
	StolenWalletRegistryAbi,
	StolenWalletRegistryFactory,
} from '@wallet-hygiene/swr-contracts';
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { useState, useEffect, useRef } from 'react';
import { FaWallet } from 'react-icons/fa';
import {
	chain,
	useAccount,
	useContract,
	useContractReads,
	useNetwork,
	useProvider,
	useSigner,
	useSignTypedData,
} from 'wagmi';

interface StandardAcknowledgementProps {
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
	tempRelayer: string;
	setTempRelayer: React.Dispatch<React.SetStateAction<string>>;
}

const StandardAckowledgement: React.FC<StandardAcknowledgementProps> = ({
	address,
	onOpen,
	setTempRelayer,
	tempRelayer,
	setNextStep,
}) => {
	const [acknowledgement, setAcknowledgment] = useState<signTypedDataProps>();
	const [relayerIsValid, setRelayerIsValid] = useState(false);
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const debouncedTrustedRelayer = useDebounce(tempRelayer, 500);
	const typedSignature = useSignTypedData();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();

	const [localState] = useLocalStorage();

	const handleChangeRelayer = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempRelayer(e.target.value);
	};

	const handleSignAndPay = async () => {
		try {
			const { domain, types, value } = await buildAcknowledgementStruct({
				signer,
				address,
				chainId: chain?.id!,
			});
			setDeadline(value.deadline);
			await typedSignature.signTypedDataAsync({ domain, types, value });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setRelayerIsValid(ethers.utils.isAddress(debouncedTrustedRelayer));

		if (!relayerIsValid) {
			console.log('relayer not valid');
		}
	}, [debouncedTrustedRelayer]);

	useEffect(() => {
		if (typedSignature.data) {
			console.log(CONTRACT_ADDRESSES.local.StolenWalletRegistry);
			const registryContract = new Contract(
				CONTRACT_ADDRESSES.local.StolenWalletRegistry,
				StolenWalletRegistryAbi,
				signer as Signer
			);

			const { v, r, s } = ethers.utils.splitSignature(typedSignature.data);

			registryContract.acknowledgementOfRegistry(localState.address, deadline, v, r, s).then(() => {
				setNextStep();
			});
		}
	}, [typedSignature.data]);

	return (
		<AcknowledgementForm
			handleSignature={handleSignAndPay}
			relayerIsValid={true}
			handleChangeRelayer={() => {}}
			onOpen={onOpen}
			relayer={address}
		/>
	);
};

export default StandardAckowledgement;
