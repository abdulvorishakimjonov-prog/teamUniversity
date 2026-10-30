import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

const cacheLocation = join(tmpdir(), `teamUniversity-stylelint-${createHash("sha256").update(process.cwd()).digest("hex").slice(0, 12)}`);

export const lintCss = async () => {
	const { default: stylelint } = await import("stylelint");
	const { output, errored, results } = await stylelint.lint({
		files: app.path.lint.scss,
		cache: true,
		cacheLocation,
		formatter: "string"
	});

	if (output && output.trim()) console.log(output);

	if (errored) {
		const failed = results.filter(r => r.errored);
		const summary = failed.map(r =>
			r.warnings
				.filter(w => w.severity === "error")
				.map(w => `  ${r.source}:${w.line}:${w.column}\n    ${w.text}`)
				.join("\n")
		).join("\n");

		const error = new Error(
			`Stylelint: ${failed.length} file(s) failed, compilation skipped\n${summary}`
		);
		error.showStack = false;
		throw error;
	}
};
