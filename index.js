// Requirements
var map = require('map-stream');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');

// Variables
var fileList, count;

// Helper function
function addFilenameToFilelist(filename, outputFile) {
    // Add filename to the list of files
    fileList['file-' + count] = filename;

    // Increase filecount
    count++;

    // Set up filestream
    var wstream = fs.createWriteStream(outputFile);

    // Handle errors
    wstream.on('error', function(err) {
        console.log('Stream error: ' + err);
    });

    // Write fileList to file and close stream
    wstream.write(JSON.stringify(fileList));
    wstream.end();
}

// Plugin function
module.exports = function(options) {
    // Prepare options
    options = options || {};
    options.outputfile = options.outputfile || 'assets.json';

    // Reset variables before map
    fileList = {};
    count = 1;

    return map(function(file, callback) {
        // Let empty files pass
        if (file.isNull()) { return callback(null, file); }

        // Emit error for streams
        if (file.isStream()) { return callback(new gutil.PluginError('gulp-filename', 'Streams are not supported!')); }

        // Retrieve filename
        var filename = path.basename(file.path);

        if (options.log) {
            // Log to console
            gutil.log('Filename:', gutil.colors.green(filename));
        }

        // Add file to fileList
        addFilenameToFilelist(filename, options.outputfile);

        callback(null, file);
    });
};