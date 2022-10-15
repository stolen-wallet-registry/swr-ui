import React, { useEffect, useState } from 'react';
import { LanguageAttributes, LANGUAGE_MAP, LANGUAGE_OPTIONS } from './languageData';

import { Box } from '@chakra-ui/react';

const ROTATING_TEXT_ONE = '';
const ROTATING_TEXT_TWO = '';

const optionCount = 10;

interface MetadataProps extends Object {}

interface SoulBoundProps {
	selectedLanguage: LanguageAttributes;
	backgroundColor?: string;
	demoAllClicked: boolean;
	setDemoAllClicked: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedLanguage: React.Dispatch<React.SetStateAction<LanguageAttributes>>;
	metadata?: MetadataProps;
}

const SoulBound: React.FC<SoulBoundProps> = ({
	selectedLanguage,
	demoAllClicked,
	setDemoAllClicked,
	setSelectedLanguage,
	backgroundColor,
	metadata,
}) => {
	const [demoFinished, setDemoFinished] = useState(true);
	useEffect(() => {
		let timer: NodeJS.Timer;
		let options: string[];

		if (demoFinished && demoAllClicked) {
			setDemoFinished(false);
			options = LANGUAGE_OPTIONS.sort(() => 0.5 - Math.random());
			let i = 0;

			timer = setInterval(() => {
				i++;
				setSelectedLanguage(LANGUAGE_MAP[options[i]]);

				if (i === optionCount) {
					setSelectedLanguage(LANGUAGE_MAP['en-US']);
					setDemoFinished(true);
					setDemoAllClicked(false);
					i = 0;
					options = [];
				}
			}, 200);
		}

		return () => {
			clearInterval(timer);
		};
	}, [demoAllClicked]);

	return (
		<div>
			<svg
				width="290"
				height="500"
				viewBox="0 0 290 500"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
			>
				<defs>
					<path
						id="text-path-a"
						d="M40 12 H255 A35 28 0 0 1 278 40 V460 A35 28 0 0 1 255 488 H40 A35 28 0 0 1 12 460 V40 A35 28 0 0 1 40 12 z"
					/>
				</defs>
				{/* <!-- TODO check height --> */}
				<rect width="100%" height="100%" rx="40" />
				<rect
					x="16"
					y="16"
					width="258"
					height="468"
					rx="26"
					ry="26"
					fill="rgba(0,0,0,0)"
					stroke="#fff"
				/>
				{/* <g style={{ transform: 'translate(226px, 392px)' }}>
        <rect
          width="36px"
          height="36px"
          rx="8px"
          ry="8px"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
        />
        <g>
          <path
            style={{ transform: 'translate(6px,6px)' }}
            d="M12 0L12.6522 9.56587L18 1.6077L13.7819 10.2181L22.3923 6L14.4341 11.3478L24 12L14.4341 12.6522L22.3923 18L13.7819 13.7819L18 22.3923L12.6522 14.4341L12 24L11.3478 14.4341L6 22.39 23L10.2181 13.7819L1.6077 18L9.56587 12.6522L0 12L9.56587 11.3478L1.6077 6L10.2181 10.2181L6 1.6077L11.3478 9.56587L12 0Z"
            fill="white"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="10s"
            repeatCount="indefinite"
          />
        </g>
      </g> */}
				<text textRendering="optimizeSpeed" fill="#fff" fontFamily="Helvetica" fontSize="10">
					<textPath
						startOffset="-100%"
						fill="#fff"
						fontFamily="Helvetica"
						fontSize="10px"
						fontWeight="bold"
						xlinkHref="#text-path-a"
					>
						compromised-wallet-registry.xyz
						<animate
							additive="sum"
							attributeName="startOffset"
							from="0%"
							to="100%"
							begin="0s"
							dur="30s"
							repeatCount="indefinite"
						/>
					</textPath>
					<textPath
						startOffset="0%"
						fill="#fff"
						fontFamily="Helvetica"
						fontSize="10px"
						fontWeight="bold"
						xlinkHref="#text-path-a"
					>
						compromised-wallet-registry.xyz
						<animate
							additive="sum"
							attributeName="startOffset"
							from="0%"
							to="100%"
							begin="0s"
							dur="30s"
							repeatCount="indefinite"
						/>
					</textPath>
					<textPath
						startOffset="50%"
						fill="#fff"
						fontFamily="Helvetica"
						fontSize="10px"
						fontWeight="bold"
						xlinkHref="#text-path-a"
					>
						compromised-wallet-registry.eth
						<animate
							additive="sum"
							attributeName="startOffset"
							from="0%"
							to="100%"
							begin="0s"
							dur="30s"
							repeatCount="indefinite"
						/>
					</textPath>
					<textPath
						startOffset="-50%"
						fill="#fff"
						fontFamily="Helvetica"
						fontSize="10px"
						fontWeight="bold"
						xlinkHref="#text-path-a"
					>
						compromised-wallet-registry.eth
						<animate
							additive="sum"
							attributeName="startOffset"
							from="0%"
							to="100%"
							begin="0s"
							dur="30s"
							repeatCount="indefinite"
						/>
					</textPath>
				</text>
				<g fill="#fff" stroke="#000" fontFamily="Helvetica" fontSize="12" fontWeight="bold">
					{selectedLanguage?.xmlLangSimple !== 'en' && (
						<>
							<foreignObject
								xmlLang={selectedLanguage?.xmlLangSimple}
								x="25"
								y="50"
								width="245px"
								height="100%"
								xmlns="http://www.w3.org/1999/xhtml"
							>
								<Box color="white">English</Box>
							</foreignObject>
							--&gt;
							<foreignObject
								xmlLang={selectedLanguage?.xmlLang}
								x="25"
								y="70"
								width="245px"
								height="100%"
								xmlns="http://www.w3.org/1999/xhtml"
							>
								<Box color="white">This wallet has been signed as stolen.</Box>
							</foreignObject>
							--&gt;
						</>
					)}
					{selectedLanguage && (
						<>
							<foreignObject
								xmlLang={selectedLanguage?.xmlLang}
								x="25"
								y="260"
								width="245px"
								height="100%"
								xmlns="http://www.w3.org/1999/xhtml"
							>
								<Box color="white">{selectedLanguage?.translation}</Box>
							</foreignObject>
							--&gt;
							<foreignObject
								xmlLang={selectedLanguage?.xmlLangSimple}
								x="25"
								y="240"
								width="245px"
								height="100%"
								xmlns="http://www.w3.org/1999/xhtml"
							>
								<Box color="white">{selectedLanguage?.language}</Box>
							</foreignObject>
							--&gt;
						</>
					)}
				</g>
			</svg>
		</div>
	);
};

export default SoulBound;
