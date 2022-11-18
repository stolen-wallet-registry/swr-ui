import { Flex, Spacer, CheckboxGroup, Checkbox, Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { buildRegistrationStruct } from '@hooks/use712Signature';
import useLocalStorage from '@hooks/useLocalStorage';
import { BigNumber, Signer } from 'ethers';
import { useState, useEffect } from 'react';
import { useNetwork, useSignTypedData } from 'wagmi';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';
import { Timer } from '@components/Timer';
import { setSignatureWithExpiry, REGISTRATION_KEY } from '@utils/signature';
import { registereePassSignature, PROTOCOLS } from '@utils/libp2p';
import { Libp2p } from 'libp2p';

interface RegisterAndSignProps {
	libp2p: Libp2p;
	signer: Signer;
	address: string;
	onOpen: () => void;
	setNextStep: () => void;
	setExpiryStep: () => void;
}

const RegisterAndSign: React.FC<RegisterAndSignProps> = ({
	libp2p,
	address,
	signer,
	onOpen,
	setNextStep,
	setExpiryStep,
}) => {
	const [deadline, setDeadline] = useState<BigNumber | null>(null);
	const [nonce, setNonce] = useState<BigNumber | null>(null);
	const typedSignature = useSignTypedData();
	const { chain } = useNetwork();

	const [localState, setLocalState] = useLocalStorage();

	const { expiryBlock } = useRegBlocksLeft(address, signer);

	const handleStreamSignature = async () => {
		if (!typedSignature?.data || !deadline || !nonce) {
			return;
		}

		await registereePassSignature({
			libp2p,
			localState,
			signature: typedSignature?.data!,
			deadline,
			nonce,
			protocol: PROTOCOLS.REG_SIG,
		});

		setNextStep();
	};

	const handleSign = async () => {
		try {
			const { domain, types, value } = await buildRegistrationStruct({
				signer,
				address,
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

	useEffect(() => {
		if (typedSignature.data) {
			// TODO set signature to pass, <delet></delet>e after passing signature
			setSignatureWithExpiry({
				keyRef: REGISTRATION_KEY,
				value: typedSignature.data,
				ttl: deadline!,
				chainId: chain?.id!,
				address: address!,
				nonce: nonce!,
			});
		}
	}, [typedSignature.data]);

	return (
		<RegistrationSection title="Include NFTs?">
			{expiryBlock && <Timer expiryBlock={expiryBlock} setExpiryStep={setExpiryStep} />}

			<>
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
						onClick={handleSign}
						disabled={localState.includeWalletNFT === null || localState.includeSupportNFT === null}
					>
						Sign
					</Button>
					<Button m={5} onClick={handleStreamSignature} disabled={!typedSignature?.data}>
						Pass Signature
					</Button>
				</Flex>
			</>
		</RegistrationSection>
	);
};

export default RegisterAndSign;
