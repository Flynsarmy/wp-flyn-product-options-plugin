/**
 * Field handlers initialization module
 * Coordinates the initialization of all individual field type handlers
 *
 * @file Central initialization for all field handlers
 * @author Product Addons Team
 */

import { initBlockButton } from './button';
import { initBlockCheckboxSwitch } from './checkbox_switch';
import { initBlockColorPicker } from './colorpicker';
import { initBlockDateTime } from './date_time';
import { initBlockFontPicker } from './fontPicker';
import { initBlockImgColorSwitch } from './img_color_switch';
import { initBlockInputs } from './inputs';
import { initBlockPopup } from './popup';
import { initBlockProducts } from './products';
import { initBlockRadio } from './radio';
import { initBlockRange } from './range';
import { initBlockSection } from './section';
import { initBlockSelect } from './select';
import { initBlockUpload } from './upload';

/**
 * Initialize all field type handlers
 * Calls initialization functions for each supported field type
 *
 * @function initialize
 */
const initialize = () => {
	initBlockButton();
	initBlockCheckboxSwitch();
	initBlockColorPicker();
	initBlockDateTime();
	initBlockImgColorSwitch();
	initBlockInputs();
	initBlockProducts();
	initBlockRadio();
	initBlockRange();
	initBlockSection();
	initBlockSelect();
	initBlockUpload();
	initBlockPopup();
	initBlockFontPicker();
};

/**
 * @namespace initFields
 * @description Field initialization utilities
 */
export const initFields = {
	initialize,
};
