const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const concat = require( 'gulp-concat' );
const cleanCSS = require( 'gulp-clean-css' );
const autoprefixer = require( 'gulp-autoprefixer' );

const fs = require( 'fs' );
const path = require( 'path' );
const zip = require( 'gulp-zip' );

function getDateTime() {
	const currDate = new Date();
	const year = currDate.getFullYear();
	const month = currDate.getMonth() + 1; // Note: Month is zero-based, so January is 0
	const day = currDate.getDate();
	const hours = currDate.getHours();
	const minutes = currDate.getMinutes();
	const seconds = currDate.getSeconds();
	return `__${ year }-${ month }-${ day }_${ hours }-${ minutes }-${ seconds }`;
}

gulp.task( 'frontend_style', function () {
	return gulp
		.src( [ './src/**/frontend.scss' ] )
		.pipe( sass() )
		.pipe(
			autoprefixer( {
				cascade: false,
			} )
		)
		.pipe( concat( 'wowaddons-frontend.css' ) )
		.pipe( cleanCSS() )
		.pipe( gulp.dest( './assets/css' ) );
} );

gulp.task( 'backend_style', function () {
	return gulp
		.src( [ './src/**/scss/backend/**/*.scss' ] )
		.pipe( sass() )
		.pipe(
			autoprefixer( {
				cascade: false,
			} )
		)
		.pipe( concat( 'wowaddons-backend.css' ) )
		.pipe( cleanCSS() )
		.pipe( gulp.dest( './assets/css' ) );
} );

gulp.task( 'blocks_style', function () {
	return gulp
		.src( [ './src/**/scss/blocks/**/*.scss' ] )
		.pipe( sass() )
		.pipe(
			autoprefixer( {
				cascade: false,
			} )
		)
		.pipe( concat( 'wowaddons-blocks.css' ) )
		.pipe( cleanCSS() )
		.pipe( gulp.dest( './assets/css' ) );
} );

gulp.task( 'watch', function () {
	gulp.watch(
		'src/**/*.scss',
		gulp.series( 'frontend_style', 'backend_style', 'blocks_style' )
	);
} );

gulp.task(
	'build',
	gulp.series( 'frontend_style', 'backend_style', 'blocks_style' )
);

let folderName = 'product-addons';
let destName = 'product-addons';
gulp.task( 'copy_files', function () {
	const filePath = path.join( __dirname, './product-addons.php' );
	const date = getDateTime();
	folderName = 'Version-Unknown' + date;

	try {
		const data = fs.readFileSync( filePath, 'utf8' );
		const versionRegex = /define\( 'PRAD_VER', '(\d+\.\d+\.\d+)' \);/;
		const match = data.match( versionRegex );
		if ( match ) {
			folderName = 'V' + match[ 1 ] + date;
			destName = destName + '-' + match[ 1 ];
		} else {
			console.log( 'Version definition not found.' );
		}
	} catch ( err ) {
		console.error( 'Error getting version: ', err );
	}

	return gulp
		.src( [
			'./**/*',
			'!./.git',
			'!./node_modules/**',
			'!./.gitignore',
			'!./src/**',
			'!./build/**',
			'!./**/*.LICENSE.txt',
			'!.*',
			'!package.json',
			'!package-lock.json',
			'!*.js',
			'!*.phar',
			'!*.yml',
			'!./assets/js/wowactions.js',
		] )
		.pipe(
			gulp.dest( `./build/${ folderName }/product-addons/`, {
				overwrite: true,
			} )
		);
} );

gulp.task( 'zip', function () {
	return (
		gulp
			.src( `./build/${ folderName }/**` )
			// @ts-ignore
			.pipe( zip( destName + '.zip' ) )
			.pipe( gulp.dest( `./build/${ folderName }/` ) )
	);
} );

gulp.task( 'package', gulp.series( 'copy_files', 'zip' ) );
