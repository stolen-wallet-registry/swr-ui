import { Flex, Spacer, CheckboxGroup, Checkbox, Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { buildAcknowledgementStruct } from '@hooks/use712Signature';
import useLocalStorage from '@hooks/useLocalStorage';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { BigNumber, ethers, Signer } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';

interface StandardAcknowledgementProps {
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
}

const StandardAckowledgement: React.FC<StandardAcknowledgementProps> = ({
	address,
	onOpen,
	setNextStep,
}) => {
	const [relayerIsValid, setRelayerIsValid] = useState(false);
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const [nonce, setNonce] = useState<BigNumber | null>(null);
	const typedSignature = useSignTypedData();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();

	const handleSign = async () => {
		try {
			const { domain, types, value } = await buildAcknowledgementStruct({
				signer,
				address,
				chain,
			});

			setDeadline(value.deadline);
			setNonce(value.nonce);

			await typedSignature.signTypedDataAsync({ domain, types, value });
		} catch (error) {
			console.log(error);
		}
	};

	const handleSignAndPay = async ({ signature }: { signature: string }) => {
		console.log(CONTRACT_ADDRESSES);
		const registryContract = new StolenWalletRegistryFactory(signer as Signer).attach(
			CONTRACT_ADDRESSES[chain?.name!].StolenWalletRegistry
		);
		const { v, r, s } = ethers.utils.splitSignature(signature);
		// deadline
		const tx = await registryContract.acknowledgementOfRegistry(
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

	useEffect(() => {
		setRelayerIsValid(ethers.utils.isAddress(address));

		if (!relayerIsValid) {
			console.log('relayer not valid');
		}
	}, [address]);

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
				{typedSignature.data ? (
					<Button
						m={5}
						onClick={() => handleSignAndPay({ signature: typedSignature.data! })}
						disabled={
							localState.includeWalletNFT === null ||
							localState.includeSupportNFT === null ||
							(localState.registrationType !== 'standardRelay' && !relayerIsValid)
						}
					>
						Pay
					</Button>
				) : (
					<Button
						m={5}
						onClick={handleSign}
						disabled={
							localState.includeWalletNFT === null ||
							localState.includeSupportNFT === null ||
							(localState.registrationType !== 'standardRelay' && !relayerIsValid)
						}
					>
						Sign
					</Button>
				)}
			</Flex>
		</RegistrationSection>
	);
};

export default StandardAckowledgement;
