import gulp from 'gulp';

//html
import bemlinter from 'gulp-html-bemlinter';
import panini from 'panini';


//js
import webpackStream from 'webpack-stream';

//sass
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import postUrl from 'postcss-url';
import csso from 'postcss-csso';


//images
import sharp from 'gulp-sharp-responsive';
import svgo from 'gulp-svgmin';
import { stacksvg } from 'gulp-stacksvg';

//other
import autoprefixer from 'autoprefixer';
import plumber from 'gulp-plumber';
import { deleteAsync } from 'del';
import browser from 'browser-sync';

const sass = gulpSass(dartSass);
let isDevelopment = true;

/* Paths */
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
	build: {
		html: distPath,
		scripts: distPath + "assets/scripts/",
		styles: distPath + "assets/styles/",
		images: distPath + "assets/images/",
		icons: distPath + "assets/images/icons/",
		fonts: distPath + "assets/fonts/"
	},
	src: {
		html: srcPath + "*.html",
		scripts: srcPath + "assets/scripts/*.js",
		styles: srcPath + "assets/styles/*.scss",
		images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
		icons: srcPath + "assets/images/icons/**/*.{svg}",
		fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
	},
	watch: {
		html: srcPath + "**/*.html",
		scripts: srcPath + "assets/scripts/**/*.js",
		styles: srcPath + "assets/styles/**/*.scss",
		images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
		icons: srcPath + "assets/images/icons/**/*.{svg}",
		fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
	},
	clean: "./" + distPath
}

export function processMarkup() {
	panini.refresh();
	return gulp.src(path.src.html, {
			base: srcPath
		})
		.pipe(plumber())
		.pipe(panini({
			root: srcPath,
			layouts: srcPath + 'layouts/',
			partials: srcPath + 'partials/',
			helpers: srcPath + 'helpers/',
			data: srcPath + 'data/'
		}))
		.pipe(gulp.dest(path.build.html));
}

export function lintBem() {
	return gulp.src(path.src.html)
		.pipe(bemlinter());
}

export function processStyles() {
	return gulp.src(path.src.styles, {
			sourcemaps: isDevelopment
		})
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			postUrl({
				assetsPath: '../'
			}),
			autoprefixer({
				cascade: true
			}),
			csso()
		]))
		.pipe(gulp.dest(path.build.styles, {
			sourcemaps: isDevelopment
		}))
		.pipe(browser.stream());
}

export function processScripts() {
	return gulp.src(path.src.scripts, {
		base: srcPath + 'assets/scripts/'
	})
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError({
					title: "JS Error",
					message: "Error: <%= error.message %>"
				})(err);
				this.emit('end');
			}
		}))
		.pipe(webpackStream({
			mode: "production",
			output: {
				filename: 'app.js',
			}
		}))
		.pipe(gulp.dest(path.build.scripts))
		.pipe(browser.stream());
}

export function optimizeImages() {
	return gulp.src(path.src.images)
		.pipe(sharp(isDevelopment ? {
			includeOriginalFile: true,
			formats: [{
				format: 'webp'
			}]
		} : {
			formats: [{
					jpegOptions: {
						progressive: true,
						mozjpeg: true
					},
					pngOptions: {
						palette: true
					}
				},
				{
					format: 'webp',
					webpOptions: {
						effort: 6
					}
				}
			]
		}))
		.pipe(gulp.dest(path.build.images));
}

export function optimizeVector() {
	return gulp.src([path.src.images, '!' + path.src.icons])
		.pipe(svgo())
		.pipe(gulp.dest(path.build.images));
}

export function createStack() {
	return gulp.src(path.src.icons)
		.pipe(svgo())
		.pipe(stacksvg())
		.pipe(gulp.dest(path.build.icons));
}

export function copyAssets() {
	return gulp.src([
			path.src.fonts,
			srcPath + '*.ico',
			srcPath + '*.webmanifest',
			srcPath + 'vendor/**/*'
		], {
			base: srcPath
		})
		.pipe(gulp.dest(distPath));
}

export function startServer(done) {
	browser.init({
		server: {
			baseDir: distPath
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done();
}

function reloadServer(done) {
	browser.reload();
	done();
}

function watchFiles() {
	gulp.watch(path.watch.styles, gulp.series(processStyles));
	gulp.watch(path.watch.scripts, gulp.series(processScripts));
	gulp.watch(path.watch.html, gulp.series(processMarkup, reloadServer));
}

function compileProject(done) {
	gulp.parallel(
		processMarkup,
		processStyles,
		processScripts,
		optimizeVector,
		createStack,
		copyAssets,
		optimizeImages
	)(done);
}

function deleteBuild() {
	return deleteAsync(path.clean);
}

export function buildProd(done) {
	isDevelopment = false;
	gulp.series(
		deleteBuild,
		compileProject
	)(done);
}

export function runDev(done) {

	gulp.series(
		deleteBuild,
		compileProject,
		startServer,
		watchFiles
	)(done);
}