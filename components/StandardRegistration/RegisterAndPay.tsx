import { Flex, Button, Text, Checkbox, CheckboxGroup, Spacer } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { Timer } from '@components/Timer';
import { buildRegistrationStruct } from '@hooks/use712Signature';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { Signer, ethers, BigNumber } from 'ethers';
import { useState } from 'react';
import { useNetwork, useSignTypedData } from 'wagmi';

interface GracePeriodInterface {
	setLocalState: (val: Partial<StateConfig>) => void;
	setExpiryStep: () => void;
	setNextStep: () => void;
	onOpen: () => void;
	signer: Signer;
}

const RegisterAndPay: React.FC<GracePeriodInterface> = ({
	setLocalState,
	onOpen,
	setNextStep,
	setExpiryStep,
	signer,
}) => {
	const [localState, _] = useLocalStorage();
	const typedSignature = useSignTypedData();
	const { chain } = useNetwork();

	const [expired, setExpired] = useState(false);
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const [nonce, setNonce] = useState<BigNumber | null>(null);
	const { expiryBlock } = useRegBlocksLeft(localState.address!, signer);

	const handleSign = async () => {
		try {
			const { domain, types, value } = await buildRegistrationStruct({
				signer,
				address: localState.address!,
				chain,
			});

			setDeadline(value.deadline);
			setNonce(value.nonce);

			//@ts-ignore
			await typedSignature.signTypedDataAsync({ domain, types, value });
		} catch (error) {
			console.log(error);
		}
	};

	const handleSignAndPay = async ({ signature }: { signature: string }) => {
		const registryContract = new StolenWalletRegistryFactory(signer as Signer).attach(
			CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry
		);

		const { v, r, s } = ethers.utils.splitSignature(signature);

		// deadline
		const tx = await registryContract.walletRegistration(
			deadline!,
			nonce!,
			localState.address!,
			v,
			r,
			s
		);

		const receipt = await tx.wait();

		setLocalState({ acknowledgementReceipt: JSON.stringify(receipt) });
		console.log(receipt);
		setNextStep();
	};

	return (
		<RegistrationSection title="Include NFTs?">
			{expiryBlock && <Timer expiryBlock={expiryBlock} setExpiryStep={setExpiryStep} />}
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
				{typedSignature.data ? (
					<Button
						m={5}
						onClick={() => handleSignAndPay({ signature: typedSignature.data! })}
						disabled={localState.includeWalletNFT === null || localState.includeSupportNFT === null}
					>
						Pay
					</Button>
				) : (
					<Button
						m={5}
						onClick={handleSign}
						disabled={localState.includeWalletNFT === null || localState.includeSupportNFT === null}
					>
						Sign
					</Button>
				)}
			</Flex>
		</RegistrationSection>
	);
};

export default RegisterAndPay;
