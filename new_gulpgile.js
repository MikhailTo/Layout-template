import gulp from gulp;

//html
import bemlinter from 'gulp-html-bemlinter';

//js
import terser from 'gulp-terser';

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
		fonts: distPath + "assets/fonts/"
	},
	src: {
		html: srcPath + "*.html",
		scripts: srcPath + "assets/js/*.js",
		styles: srcPath + "assets/scss/*.scss",
		images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
		fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
	},
	watch: {
		html: srcPath + "**/*.html",
		scripts: srcPath + "assets/js/**/*.js",
		styles: srcPath + "assets/scss/**/*.scss",
		images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
		fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
	},
	clean: "./" + distPath
}