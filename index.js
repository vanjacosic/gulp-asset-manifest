// Requirements
var map = require('map-stream');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');

// Helper function
function errorMessage(message){
    throw new gutil.PluginError('gulp-asset-manifest', message);
}

function checkManifestFile(filename) {
    // Check if manifest file exists
    return fs.existsSync(filename, function (exists) {
        return exists;
    });
}

function readManifestFile(filename) {
    // Read data from manifest file
    return fs.readFileSync(filename, 'utf8', function(err, data) {
        if (err) {
            errorMessage('Error reading manifest file.');
        }
        return data;
    });
}

function writeManifestFile(data, filename) {
    // Write data to manifest file
    fs.writeFileSync(filename, JSON.stringify(data));
}

function resetManifestFile(bundlename, filename) {
    // Check if manifest file exists
    var doesFileExist = checkManifestFile(filename);

    if(doesFileExist){
        // Read manifest file contents
        var contents = readManifestFile(filename);

        // Copy data into file list
        fileList = JSON.parse(contents);

        // Reset or create array for each bundle
        fileList[bundlename] = [];
    }
    else{
        // Create empty file list
        fileList = {};
    }

    // Write file list to manifest file
    writeManifestFile(fileList, filename);
}


// Plugin function
module.exports = function(options) {

    // Reset file list
    var fileList;

    // Prepare options
    options = options || {};
    options.manifestFile = options.manifestFile || 'asset_manifest.json';

    var pathPrepend = options.pathPrepend || '';

    if(!options.bundleName){
        errorMessage('A bundle name is required. Please refer to the docs.');
    }

    if (options.log) {
        gutil.log('Preparing bundle:', gutil.colors.green(options.bundleName));
    }

    // Reset asset file
    resetManifestFile(options.bundleName, options.manifestFile);

    // Process files
    return map(function(file, callback) {

        // Let empty files pass
        if (file.isNull()) {
            return callback(null, file);
        }

        // Emit error for streams
        if (file.isStream()) {
            errorMessage('Streams are not supported');
        }

        // Read asset file contents
        var contents = readManifestFile(options.manifestFile);

        // Copy data into file list
        fileList = JSON.parse(contents);

        var filename;

        // Retrieve filename
        if (options.includeRelativePath) {
            filename =  path.relative(process.cwd(), file.path);
        }
        else {
            filename = path.basename(file.path);
        }

        if(options.pathSeparator && options.pathSeparator !== path.sep) {
            filename = filename.split(path.sep).join(options.pathSeparator);
        }

        // Add filename to fileList
        if (!fileList[options.bundleName]){
            fileList[options.bundleName] = [];
        }

        fileList[options.bundleName].push(pathPrepend + filename);

        // Write list to asset file
        writeManifestFile(fileList, options.manifestFile);

        if (options.log) {
            gutil.log('Added', gutil.colors.green(filename), 'to asset manifest.');
        }

        callback(null, file);
    });
};
