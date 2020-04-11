import { shim } from './Shim';

/**
 * Loads variable from window with the
 * name 'google'
 *
 * @export
 * @returns {*} window['google']
 */
export const google = shim('google');
