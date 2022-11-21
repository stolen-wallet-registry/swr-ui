// https://www.toptal.com/developers/keycode - keycode helper tool
// taken from: https://github.com/AudiusProject/audius-client/blob/main/packages/stems/src/utils/hotkeyUtil.ts
import { size, throttle } from 'lodash';

export enum ModifierKeys {
	CMD = 0,
	CTRL = 1,
	SHIFT = 2,
	ALT = 3,
}

type ModifierHandler = {
	cb: (e?: KeyboardEvent) => void;
	or?: ModifierKeys[];
	and?: ModifierKeys[];
};

type Handler = (e?: KeyboardEvent) => void;
export type Mapping = {
	[key: number]: Handler | ModifierHandler;
};

/**
 * Checks whether the DOM is in a state where a global hotkey press is allowed.
 * For example, even if an anchor tag has focus, it should not prevent global hotkeys
 * from working.
 * @returns {boolean} whether or not a global hotkey press is allowed.
 */
function allowGlobalHotkeyPress() {
	return (
		document.activeElement &&
		(document.activeElement === document.body ||
			document.activeElement.nodeName === 'A' /* <a> */ ||
			document.activeElement.nodeName === 'BUTTON' /* <button> */ ||
			document.activeElement.getAttribute('role') === 'button')
	); /* Lottie button */
}

function isModifierPressed(modifier: ModifierKeys, e: KeyboardEvent) {
	if (modifier === ModifierKeys.CMD) return e.metaKey;
	if (modifier === ModifierKeys.CTRL) return e.ctrlKey;
	if (modifier === ModifierKeys.SHIFT) return e.shiftKey;
	if (modifier === ModifierKeys.ALT) return e.altKey;
	return false;
}

function fireHotkey(e: KeyboardEvent, mapping: Mapping, preventDefault: boolean) {
	if (allowGlobalHotkeyPress() && e.keyCode in mapping) {
		if (size(mapping[e.keyCode]) > 1) {
			const cb = (mapping[e.keyCode] as ModifierHandler).cb;
			const or = (mapping[e.keyCode] as ModifierHandler).or;
			const and = (mapping[e.keyCode] as ModifierHandler).and;

			let satisfiedOr = true;
			if (or) {
				satisfiedOr = false;
				or.forEach((modifier) => {
					if (isModifierPressed(modifier as ModifierKeys, e)) satisfiedOr = true;
				});
			}

			let satisfiedAnd = true;
			if (and) {
				and.forEach((modifier) => {
					if (!isModifierPressed(modifier, e)) satisfiedAnd = false;
				});
			}

			if (satisfiedOr && satisfiedAnd) {
				if (preventDefault) e.preventDefault();
				cb(e);
			}
		} else {
			// If no modifier keys are required, fire the callback.
			if (preventDefault) e.preventDefault();
			(mapping[e.keyCode] as Handler)(e);
		}
	}
}

/**
 * Sets up hotkeys for a component. Should generally be called in componentDidMount.
 * @param {function|Object} mapping the hotkey mapping keycodes to callback.
 * @param {Number} throttleMs the number of milliseconds to throttle keydown events with.
 * For example:
 *  setupHotkeys({32: this.playMusic})  // fires playMusic() on 'space'
 *
 * The mapping values may be an object with three fields:
 *  cb: the callback to fire
 *  or: modifier keys that must be OR'd with the hotkey
 *  and: modifier keys that must be AND'd with the hotkey
 *
 * For example:
 *  setupHotkeys({32: {cb: this.playMusic, or: [CMD, CTRL]})
 *    // fires on 'cmd+space' or 'ctrl+space'
 *  setupHotkeys({32: {cb: this.playMusic, and: [CMD, CTRL]})
 *    // fires on 'cmd+ctrl+space'
 *  setupHotkeys({32: {cb: this.playMusic, or: [ALT, CTRL], and: [CMD, SHIFT]})
 *    // fires on 'cmd+shift+alt+space' or 'cmd+shift+ctrl+space'\
 * @returns {function} the event listener function
 */
export function setupHotkeys(mapping: Mapping, throttleMs = 100, preventDefault = true) {
	const hotkeyHook = (e: KeyboardEvent) => {
		fireHotkey(e, mapping, preventDefault);
	};
	const throttledHook = (e: KeyboardEvent) =>
		throttle(hotkeyHook, throttleMs, { leading: true })(e);
	document.addEventListener('keydown', throttledHook, false);
	return throttledHook;
}

/**
 * Removes a hotkey event listener.
 * @param {function} hook the function hook returned by setupHotkeys.
 */
export function removeHotkeys(hook: (e: KeyboardEvent) => void) {
	document.removeEventListener('keydown', hook, false);
}

//
/*
| Key Name                              | Key code |
| ------------------------------------- | -------- |
| backspace                             | 8        |
| tab                                   | 9        |
| enter                                 | 13       |
| shift                                 | 16       |
| ctrl                                  | 17       |
| alt                                   | 18       |
| pause/break                           | 19       |
| caps lock                             | 20       |
| escape                                | 27       |
| page up                               | 33       |
| Space                                 | 32       |
| page down                             | 34       |
| end                                   | 35       |
| home                                  | 36       |
| arrow left                            | 37       |
| arrow up                              | 38       |
| arrow right                           | 39       |
| arrow down                            | 40       |
| print screen                          | 44       |
| insert                                | 45       |
| delete                                | 46       |
| 0                                     | 48       |
| 1                                     | 49       |
| 2                                     | 50       |
| 3                                     | 51       |
| 4                                     | 52       |
| 5                                     | 53       |
| 6                                     | 54       |
| 7                                     | 55       |
| 8                                     | 56       |
| 9                                     | 57       |
| a                                     | 65       |
| b                                     | 66       |
| c                                     | 67       |
| d                                     | 68       |
| e                                     | 69       |
| f                                     | 70       |
| g                                     | 71       |
| h                                     | 72       |
| i                                     | 73       |
| j                                     | 74       |
| k                                     | 75       |
| l                                     | 76       |
| m                                     | 77       |
| n                                     | 78       |
| o                                     | 79       |
| p                                     | 80       |
| q                                     | 81       |
| r                                     | 82       |
| s                                     | 83       |
| t                                     | 84       |
| u                                     | 85       |
| v                                     | 86       |
| w                                     | 87       |
| x                                     | 88       |
| y                                     | 89       |
| z                                     | 90       |
| left window key                       | 91       |
| right window key                      | 92       |
| select key                            | 93       |
| numpad 0                              | 96       |
| numpad 1                              | 97       |
| numpad 2                              | 98       |
| numpad 3                              | 99       |
| numpad 4                              | 100      |
| numpad 5                              | 101      |
| numpad 6                              | 102      |
| numpad 7                              | 103      |
| numpad 8                              | 104      |
| numpad 9                              | 105      |
| multiply                              | 106      |
| add                                   | 107      |
| subtract                              | 109      |
| decimal point                         | 110      |
| divide                                | 111      |
| f1                                    | 112      |
| f2                                    | 113      |
| f3                                    | 114      |
| f4                                    | 115      |
| f5                                    | 116      |
| f6                                    | 117      |
| f7                                    | 118      |
| f8                                    | 119      |
| f9                                    | 120      |
| f10                                   | 121      |
| f11                                   | 122      |
| f12                                   | 123      |
| num lock                              | 144      |
| scroll lock                           | 145      |
| My Computer (multimedia keyboard)     | 182      |
| My Calculator (multimedia keyboard)   | 183      |
| semi-colon                            | 186      |
| equal sign                            | 187      |
| comma                                 | 188      |
| dash                                  | 189      |
| period                                | 190      |
| forward slash                         | 191      |
| open bracket                          | 219      |
| back slash                            | 220      |
| close braket                          | 221      |
| single quote                          | 222      |
*/
