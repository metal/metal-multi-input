'use strict';

import core from 'metal';
import templates from './InputMatrix.soy.js';
import Component from 'metal-component';
import Soy from 'metal-soy';

/**
 * This component automatically adds new fields to guarantee that there will
 * always be an empty field at the end of the list.
 */
class InputMatrix extends Component {
	/**
	 * Converts the specified element attribute to an integer.
	 * @param {!Element} element
	 * @param {string} attrName
	 * @return {number}
	 * @protected
	 */
	convertAttrToInt_(element, attrName) {
		return parseInt(element.getAttribute(attrName), 10);
	}

	/**
	 * Handles an `input` event from one of the text fields. Updates the values
	 * and adds an extra field when necessary.
	 * @param {!Event} event
	 * @protected
	 */
	handleInput_(event) {
		const element = event.delegateTarget;
		const fieldIndex = this.convertAttrToInt_(element, 'data-field-index');
		const rowIndex = this.convertAttrToInt_(element, 'data-row-index');
		this.fields[rowIndex][fieldIndex] = this.fields[rowIndex][fieldIndex] || {};
		this.fields[rowIndex][fieldIndex].value = element.value;
		this.fields = this.fields;
	}

	/**
	 * Handles a `click` event from one of the field's remove button.
	 * @param {!Event} event
	 * @protected
	 */
	handleRemoveClick_(event) {
		const element = event.delegateTarget;
		const index = this.convertAttrToInt_(element, 'data-row-index');
		this.fields.splice(index, 1);
		this.fields = this.fields;
	}

	/**
	 * Sets the `fields` state property. If the last row contains at least one
	 * non empty field that doesn't have `disableDuplication` set to true, a new
	 * row will be added automatically here.
	 * @param {!Array<!Array<string>} fields
	 * @return {!Array<!Array<string>}
	 * @protected
	 */
	setFieldsFn_(fields) {
		if (!fields.length) {
			fields = [[]];
		}

		const lastRow = fields[fields.length - 1];
		for (let i = 0; i < this.fieldsConfig.length; i++) {
			var config = this.fieldsConfig[i];
			var hasValue = lastRow[i] && lastRow[i].value && lastRow[i].value !== '';
			if (hasValue && !config.disableDuplication) {
				fields.push([]);
				break;
			}
		}

		return fields;
	}
}
Soy.register(InputMatrix, templates);

InputMatrix.STATE = {
	/**
	 * Information for each rendered field, in each row. Each field object can
	 * contain the following data:
	 * - {string=} value The field's current value
	 * - {string-} error The error message to be rendered for the field.
	 * @type {!Array<!Array<!Object>>}
	 */
	fields: {
		setter: 'setFieldsFn_',
		validator: core.isArray,
		valueFn: () => []
	},

	/**
	 * An array of objects representing fields that should be rendered together.
	 * Each field config can have one of the following configuration options:
	 * - {boolean=} disableDuplication Optional flag indicating that typing on
	 *     this field should not cause another row of fields to be created even if
	 *     it was on the last row.
	 * - {string=} label Optional label for the field.
	 * - {string=} name Optional field name, which will have a counter suffix
	 *     indicating its row position.
	 * - {string=} placeholder Optional placeholder for the field.
	 * @type {!Array<!Object>}
	 */
	fieldsConfig: {
		validator: core.isArray,
		valueFn: () => [{}]
	}
};

export default InputMatrix;