import { Flex, CheckboxGroup, Checkbox, Button, Text, Box } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage, { accessLocalStorage } from '@hooks/useLocalStorage';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { ethers, Signer } from 'ethers';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { Timer } from '@components/Timer';
import { relayerPostBackMsg, PROTOCOLS } from '@utils/libp2p';
import { getSignatureWithExpiry, REGISTRATION_KEY } from '@utils/signature';
import { Libp2p } from 'libp2p';

interface RegistrationProps {
	libp2p: Libp2p;
	signer: Signer;
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
	setExpiryStep: () => void;
}

const RegistrationPayment: React.FC<RegistrationProps> = ({
	libp2p,
	address,
	signer,
	onOpen,
	setNextStep,
	setExpiryStep,
}) => {
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();
	const [receipt, setReceipt] = useState<ethers.providers.TransactionReceipt | null>(null);
	const { expiryBlock } = useRegBlocksLeft(address, signer);

	const handleSignAndPay = async () => {
		try {
			const registryContract = StolenWalletRegistryFactory.connect(
				CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
				signer!
			);

			const storedSignature = getSignatureWithExpiry({
				keyRef: REGISTRATION_KEY,
				chainId: chain?.id!,
				address: localState.trustedRelayerFor!,
			});

			const deadline = ethers.BigNumber.from(storedSignature.deadline);
			const nonce = ethers.BigNumber.from(storedSignature.nonce);

			const { v, r, s } = ethers.utils.splitSignature(storedSignature.value);

			const tx = await registryContract.walletRegistration(
				deadline,
				nonce,
				localState.trustedRelayerFor!,
				v,
				r,
				s
			);

			const receipt = await tx.wait();
			setLocalState({ registrationReceipt: JSON.stringify(receipt) });
			setReceipt(receipt);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!localState.includeWalletNFT) {
			setLocalState({ includeWalletNFTAgree: false });
		}

		if (!localState.includeSupportNFT) {
			setLocalState({ includeSupportNFTAgree: false });
		}
	}, []);

	useEffect(() => {
		if (receipt?.status === 1) {
			relayerPostBackMsg({
				libp2p: libp2p,
				localState: accessLocalStorage(),
				protocol: PROTOCOLS.REG_PAY,
			});

			setNextStep();
		}
	}, [receipt?.status]);

	return (
		<RegistrationSection title="Include NFTs?">
			{expiryBlock && <Timer expiryBlock={expiryBlock} setExpiryStep={setExpiryStep} />}
			<Flex>
				<Box>Registeree wants to include the following with their registration:</Box>
				{localState.includeWalletNFT && (
					<Flex>
						<Text>1 non burnable, non transferable Wallet NFT, do you agree?</Text>
						<CheckboxGroup>
							<Checkbox
								width={[100, 100]}
								isChecked={localState.includeWalletNFTAgree === true}
								isRequired={true}
								onChange={() => setLocalState({ includeWalletNFTAgree: true })}
							>
								Yes
							</Checkbox>
							<Checkbox
								width={[100, 100]}
								isRequired={true}
								onChange={() => setLocalState({ includeWalletNFTAgree: false })}
								isChecked={localState.includeWalletNFTAgree === false}
							>
								No
							</Checkbox>
						</CheckboxGroup>
					</Flex>
				)}
				{localState.includeSupportNFT && (
					<Flex>
						<Box>1 Supportive NFT, do you agree?</Box>
						<CheckboxGroup>
							<Checkbox
								width={[100, 100]}
								isRequired={true}
								isChecked={localState.includeSupportNFTAgree === true}
								onChange={() => setLocalState({ includeSupportNFTAgree: true })}
							>
								Yes
							</Checkbox>
							<Checkbox
								width={[100, 100]}
								isChecked={localState.includeSupportNFTAgree === false}
								isRequired={true}
								onChange={() => setLocalState({ includeSupportNFTAgree: false })}
							>
								No
							</Checkbox>
						</CheckboxGroup>
					</Flex>
				)}
				<Flex alignSelf="flex-end">
					<Button m={5} onClick={onOpen}>
						View NFT
					</Button>
					<Button m={5} onClick={() => handleSignAndPay()}>
						{/* disabled={
							localState.includeWalletNFTAgree === null ||
							localState.includeSupportNFTAgree === null
						} */}
						Pay
					</Button>
				</Flex>
			</Flex>
		</RegistrationSection>
	);
};

export default RegistrationPayment;
