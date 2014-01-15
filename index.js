// Requirements
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');

// Variables
var PLUGIN_NAME = 'gulp-filename';
var payload = {};
var count = 1;

function addToPayload(filename){
    // Add filename to the list of files
    payload['file-' + count] = filename;
    count++;
}

function writePayloadToFile(outputFile) {
    // Set up filestream
    var wstream = fs.createWriteStream(outputFile);

    // Handle errors
    wstream.on('error', function(err) {
        console.log('Stream error: ' + err);
    });

    // Write payload to file and close stream
    wstream.write(JSON.stringify(payload));
    wstream.end();
}

// Plugin level function
function gulpFilename(outputFile) {

    if (!outputFile) {
        outputFile = 'files.json';
    }

    // Creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            // Do nothing if no contents
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            // Emit error if stream
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }

        if (file.isBuffer()) {
            // Retrieve filename
            var filename = path.basename(file.path);

            // Add file to payload
            addToPayload(filename);

            // Output list as file
            writePayloadToFile(outputFile);

            // Return original file unaltered
            this.push(file);
            return callback();
        }
    });

    // returning the file stream
    return stream;
}

// Exporting the plugin main function
module.exports = gulpFilename;