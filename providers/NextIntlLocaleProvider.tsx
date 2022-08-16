import {
	AbstractIntlMessages,
	Formats,
	IntlError,
	NextIntlProvider,
	RichTranslationValues,
	IntlErrorCode,
} from 'next-intl';
import { AppProps } from 'next/app';
import { ReactNode } from 'react';

type NextIntlProviderProps = {
	/** All messages that will be available in your components. */
	messages?: AbstractIntlMessages;
	/** A valid Unicode locale tag (e.g. "en" or "en-GB"). */
	locale: string;
	/** Global formats can be provided to achieve consistent
	 * formatting across components. */
	formats?: Partial<Formats>;
	/** A time zone as defined in [the tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) which will be applied when formatting dates and times. If this is absent, the user time zone will be used. You can override this by supplying an explicit time zone to `formatDateTime`. */
	timeZone?: string;
	/** This callback will be invoked when an error is encountered during
	 * resolving a message or formatting it. This defaults to `console.error` to
	 * keep your app running. You can customize the handling by taking
	 * `error.code` into account. */
	onError?(error: IntlError): void;
	/** Will be called when a message couldn't be resolved or formatting it led to
	 * an error. This defaults to `${namespace}.${key}` You can use this to
	 * customize what will be rendered in this case. */
	getMessageFallback?(info: { namespace?: string; key: string; error: IntlError }): string;
	/** All components that use the provided hooks should be within this tree. */
	children: ReactNode;
	/**
	 * Providing this value will have two effects:
	 * 1. It will be used as the default for the `now` argument of
	 *    `useIntl().formatRelativeTime` if no explicit value is provided.
	 * 2. It will be returned as a static value from the `useNow` hook. Note
	 *    however that when `updateInterval` is configured on the `useNow` hook,
	 *    the global `now` value will only be used for the initial render, but
	 *    afterwards the current date will be returned continuously.
	 */
	now?: Date;
	/** Global default values for translation values and rich text elements.
	 * Can be used for consistent usage or styling of rich text elements.
	 * Defaults will be overidden by locally provided values. */
	defaultTranslationValues?: RichTranslationValues;
};

const onError = (error: IntlError) => {
	if (error.code === IntlErrorCode.MISSING_MESSAGE) {
		// Missing translations are expected and should only log an error
		console.error('IntlErrorCode.MISSING_MESSAGE: ', error);
	} else {
		// Other errors indicate a bug in the app and should be reported
		console.error(error);
	}
};

interface messageFallbackProps {
	namespace?: string;
	key: string;
	error: IntlError;
}

const getMessageFallback = ({ namespace, key, error }: messageFallbackProps) => {
	const path = [namespace, key].filter((part) => part != null).join('.');

	if (error.code === IntlErrorCode.MISSING_MESSAGE) {
		return `${path} is not yet translated`;
	} else {
		return `Dear developer, please fix this message: ${path}`;
	}
};

interface NextIntlLocaleProviderProps {
	pageProps: AppProps & NextIntlProviderProps;
}

const NextIntlLocaleProvider: React.FC<NextIntlLocaleProviderProps> = ({ pageProps, children }) => {
	return (
		<NextIntlProvider
			messages={pageProps.messages}
			locale="en"
			// To achieve consistent date, time and number formatting
			// across the app, you can define a set of global formats.
			formats={{
				dateTime: {
					short: {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					},
				},
			}}
			// Providing an explicit value for `now` ensures consistent formatting of
			// relative values regardless of the server or client environment.
			now={new Date(pageProps.now as Date)}
			// Also an explicit time zone is helpful to ensure dates render the
			// same way on the client as on the server, which might be located
			// in a different time zone.
			timeZone="America/New_York"
			onError={onError}
			getMessageFallback={getMessageFallback}
		>
			{children}
		</NextIntlProvider>
	);
};

export default NextIntlLocaleProvider;
