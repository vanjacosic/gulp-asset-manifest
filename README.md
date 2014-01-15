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
var rev = require('gulp-rev'); // Optional
var filename = require('gulp-filename');

gulp.task('default', function () {
	gulp.src('src/*.js')
		.pipe(rev()) // Optional
		.pipe(filename())
		.pipe(gulp.dest('dist'));
});
```

## License
MIT © Vanja Cosic