# [gulp](https://github.com/wearefractal/gulp)-filename

> Gulp plugin for writing filenames to a JSON file.

We needed to make hashed asset filenames available in a common format.
Can easily be modified to suit your own purposes.

Works great with [gulp-rev](https://github.com/sindresorhus/gulp-rev) by Sindre Sorhus.
`gulp-rev` adds hashes to the filename, `gulp-filename` lists the filenames in a JSON file.

## Install

Install with npm from GitHub

```
npm install --save-dev git+https://github.com/vanjacosic/gulp-filename.git
```


## Example

```js
var gulp = require('gulp');
var filename = require('gulp-filename');

// Simple usage
gulp.task('default', function () {
	gulp.src('src/*.js')
		.pipe(filename({bundleName: 'app_scripts'}))
		.pipe(gulp.dest('dist'));
});


// Usage with options
gulp.task('default', function () {
	gulp.src('src/*.js')
		.pipe(filename({ bundleName: 'app_scripts', pathPrepend: 'build/', assetFile: 'assets/asset_manifest.json', log: true}))
		.pipe(gulp.dest('dist'));
});


// Default usage (with gulp-rev)
var rev = require('gulp-rev'); // Optional

gulp.task('default', function () {
	gulp.src('src/*.js')
		.pipe(rev()) // Optional
		.pipe(filename({bundleName: 'app_scripts'}))
		.pipe(gulp.dest('dist'));
});
```

## API

### filename(options)

#### options.bundleName
Type: `String`
Required: Yes

Path of the asset file the plugin reads from and writes to.

#### options.assetFile
Type: `String`
Default: `assets.json`
Required: No

Path of the asset file the plugin reads from and writes to.

#### options.pathPrepend
Type: `String`
Default: ``
Required: No

Prepend a path to the filename. Eg. 'assets/build/'

#### options.log
Type: `Boolean`
Default: `false`
Required: No

Will output filenames to console if true.

## License
MIT © Vanja Cosic