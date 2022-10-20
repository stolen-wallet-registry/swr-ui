import languageData from './data.json';

export interface LanguageAttributes {
	xmlLang: string;
	xmlLangSimple: string;
	systemLanguage: string;
	translation: string;
	language: string;
}

export const LANGUAGE_MAP = languageData as Record<string, LanguageAttributes>;
export const LANGUAGE_OPTIONS = Object.keys(LANGUAGE_MAP);
export const LANGUAGE_DISPLAY = LANGUAGE_OPTIONS.map((key) => [
	LANGUAGE_MAP[key].xmlLang,
	`${LANGUAGE_MAP[key].xmlLang} -- ${LANGUAGE_MAP[key].language}`,
]);
