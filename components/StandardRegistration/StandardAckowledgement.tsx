import { Flex, Spacer, CheckboxGroup, Checkbox, Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { buildAcknowledgementStruct, signTypedDataProps } from '@hooks/use712Signature';
import useDebounce from '@hooks/useDebounce';
import useLocalStorage from '@hooks/useLocalStorage';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { SelfRelaySteps } from '@utils/types';
import { StolenWalletRegistryAbi } from '@wallet-hygiene/swr-contracts';
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';

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

	const [localState, setLocalState] = useLocalStorage();

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
				StolenWalletRegistryAbi.abi,
				signer as Signer
			);

			const { v, r, s } = ethers.utils.splitSignature(typedSignature.data);

			registryContract.acknowledgementOfRegistry(localState.address, deadline, v, r, s).then(() => {
				setNextStep();
			});
		}
	}, [typedSignature.data]);

	return (
		<RegistrationSection title="Include NFTs?">
			<Flex>
				<Text mr={20}>
					Include{' '}
					<Text as="span" fontWeight="bold" decoration="underline">
						Supportive
					</Text>{' '}
					NFT?
				</Text>
				<Spacer />
				<CheckboxGroup>
					<Checkbox
						width={[100, 100]}
						isChecked={localState.includeWalletNFT === true}
						isRequired={true}
						onChange={() => setLocalState({ includeWalletNFT: true })}
					>
						Yes
					</Checkbox>
					<Checkbox
						width={[100, 100]}
						isRequired={true}
						onChange={() => setLocalState({ includeWalletNFT: false })}
						isChecked={localState.includeWalletNFT === false}
					>
						No
					</Checkbox>
				</CheckboxGroup>
			</Flex>
			<Flex mb={5}>
				<Text mr={20}>
					Include{' '}
					<Text as="span" fontWeight="bold" decoration="underline">
						Wallet
					</Text>{' '}
					NFT?
				</Text>
				<Spacer />
				<CheckboxGroup>
					<Checkbox
						width={[100, 100]}
						isRequired={true}
						isChecked={localState.includeSupportNFT === true}
						onChange={() => setLocalState({ includeSupportNFT: true })}
					>
						Yes
					</Checkbox>
					<Checkbox
						width={[100, 100]}
						isChecked={localState.includeSupportNFT === false}
						isRequired={true}
						onChange={() => setLocalState({ includeSupportNFT: false })}
					>
						No
					</Checkbox>
				</CheckboxGroup>
			</Flex>
			<Flex alignSelf="flex-end">
				<Button m={5} onClick={onOpen}>
					View NFT
				</Button>
				<Button
					m={5}
					onClick={handleSignAndPay}
					disabled={
						localState.includeWalletNFT === null ||
						localState.includeSupportNFT === null ||
						// acknowledgement === null ||
						(localState.registrationType !== 'standardRelay' && !relayerIsValid)
					}
				>
					Sign and Pay
				</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default StandardAckowledgement;
