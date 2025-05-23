import { registry } from "@web/core/registry";
import { SelectionField, selectionField } from "@web/views/fields/selection/selection_field";

/**
 * The purpose of this field is to be able to define some values which should not be
 * displayed on our selection field, this way we can have multiple views for the same model
 * that uses different possible sets of values on the same selection field.
 */
export class FilterableSelectionField extends SelectionField {
    static props = {
        ...SelectionField.props,
        whitelist_fname: { type: String, optional: true },
        whitelisted_values: { type: Array, optional: true },
        blacklisted_values: { type: Array, optional: true },
    };

    /**
     * @override
     */
    get options() {
        let options = super.options;
        if (this.props.whitelist_fname) {
            options = options.filter((option) => {
                return (
                    option[0] === this.props.record.data[this.props.name] ||
                    this.props.record.data[this.props.whitelist_fname].includes(option[0])
                );
            });
        } else if (this.props.whitelisted_values) {
            options = options.filter((option) => {
                return (
                    option[0] === this.props.record.data[this.props.name] ||
                    this.props.whitelisted_values.includes(option[0])
                );
            });
        } else if (this.props.blacklisted_values) {
            options = options.filter((option) => {
                return (
                    option[0] === this.props.record.data[this.props.name] ||
                    !this.props.blacklisted_values.includes(option[0])
                );
            });
        }
        return options;
    }
}

export const filterableSelectionField = {
    ...selectionField,
    component: FilterableSelectionField,
    supportedOptions: [
        {
            label: "Whitelisted Values",
            name: "whitelisted_values",
            type: "string",
        },
        {
            label: "Blacklisted Values",
            name: "blacklisted_values",
            type: "string",
        },
        {
            label: "Whitelisted field name",
            name: "whitelist_fname",
            type: "string",
        },
    ],
    extractProps({ options }) {
        const props = selectionField.extractProps(...arguments);
        props.whitelist_fname = options.whitelist_fname;
        props.whitelisted_values = options.whitelisted_values;
        props.blacklisted_values = options.blacklisted_values;
        return props;
    },
};

registry.category("fields").add("filterable_selection", filterableSelectionField);
