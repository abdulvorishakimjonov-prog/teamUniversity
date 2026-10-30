import stylelint from "stylelint";

const ruleName = "project/nested-kebab";
const messages = {
	rejected: selector => `Unexpected non-kebab-case nesting "${selector}"`
};

const segment = "(?:[a-z0-9-]+|__[a-z0-9-]+|_[0-9]+)";
const allowed = new RegExp(`^${segment}+$`);

export default stylelint.createPlugin(ruleName, primary => (root, result) => {
	if (!primary) return;

	root.walkRules(ruleNode => {
		const selector = ruleNode.selector;
		if (!selector.includes("&")) return;

		for (const match of selector.matchAll(/&([^\s,.:>+~[{}]+)/g)) {
			const suffix = match[1];
			if (!allowed.test(suffix)) {
				result.warn(messages.rejected(`&${suffix}`), { node: ruleNode });
			}
		}
	});
});

export const rule = { ruleName, messages };
