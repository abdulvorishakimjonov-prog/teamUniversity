import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import rename from "gulp-rename";
import cleanCss from 'gulp-clean-css';

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(app.path.src.scss, { sourcemap: true })
		.pipe(sass({
			outputStyle: 'compressed',
		}))
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(groupCssMediaQueries())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: [
				"last 3 iOS versions",
				"last 3 Safari versions",
				"last 3 Chrome versions",
				"last 3 Firefox versions"
			],
			cascade: true

		}))
		.pipe(cleanCss())
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(app.plugins.replace(/@\//g, '../'))
		.pipe(app.gulp.dest(app.path.build.css), { sourcemaps: '.' })
		.pipe(app.plugins.browsersync.stream())

}
