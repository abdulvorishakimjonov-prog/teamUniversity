import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

global.app = {
	path,
	gulp,
	plugins
};

import { copy, copyImages } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { lintCss } from "./gulp/tasks/lint.js";
import { syncFront, syncAssets, syncCss } from "./gulp/tasks/sync.js";

async function watcher() {
	await new Promise((resolve) => {
		gulp.watch(path.watch.assets, gulp.series(copy));
		gulp.watch(path.watch.images, copyImages);
		gulp.watch(path.watch.html, html);
		gulp.watch(path.watch.scss, gulp.series(scss));
		resolve();
	});
}

const dev = gulp.series(reset, gulp.parallel(copy, copyImages, html, scss), gulp.parallel(watcher, server));

// Productionga: watcher/serversiz bir martalik build -> dist/
const build = gulp.series(reset, lintCss, gulp.parallel(copy, copyImages, html, scss));

gulp.task('default', dev);
gulp.task('build', build);
