import exceptions from "./stylelint.exceptions.js";

const kebab = "[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?";

export default {
	extends: ["stylelint-config-standard-scss"],
	plugins: ["./stylelint.plugin-nested-kebab.js"],
	rules: {
		"selector-class-pattern": [new RegExp(`^(?:${kebab}|${exceptions.join("|")})$`)],
		"project/nested-kebab": true,
		"custom-property-pattern": /^[a-z][a-z0-9_-]*$/,
		"scss/dollar-variable-pattern": /^[a-z][a-z0-9_-]*$/,
		"keyframes-name-pattern": /^[a-zA-Z][a-zA-Z0-9-]*$/,

		"no-descending-specificity": null,
		"declaration-no-important": null,
		"scss/at-extend-no-missing-placeholder": null,
		"declaration-block-no-duplicate-properties": true,

		"property-no-vendor-prefix": null,
		"length-zero-no-unit": null,
		"color-hex-length": null,
		"color-function-notation": null,
		"color-function-alias-notation": null,
		"alpha-value-notation": null,
		"shorthand-property-no-redundant-values": null,
		"media-feature-range-notation": null,
		"declaration-empty-line-before": null,
		"custom-property-empty-line-before": null,
		"at-rule-empty-line-before": null,
		"rule-empty-line-before": null,
		"scss/double-slash-comment-empty-line-before": null
	},
	ignoreFiles: ["dist/**", "node_modules/**", "src/assets/**"]
};
