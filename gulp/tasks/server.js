export const server = (done) => {
	app.plugins.browsersync.init({
		server: {
			baseDir: `${app.path.build.html}`
		},
		notify: false,
		open: "external",
		port: 3000,
		online: false,
		cors: true, ghostMode: false
	});

	done();
};
