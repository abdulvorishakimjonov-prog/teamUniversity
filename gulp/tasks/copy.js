export const copy = () => {
	return app.gulp.src(app.path.src.assets)
		.pipe(app.gulp.dest(app.path.build.assets))
}
export const copyImages = () => {
	return app.gulp.src(app.path.src.images)
		.pipe(app.gulp.dest(app.path.build.images))
}