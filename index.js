// Requirements
var map = require('map-stream');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');

// Helper function
function errorMessage(message){
    throw new gutil.PluginError('gulp-filename', message);
}

function checkAssetFile(filename) {
    // Check if asset file exists
    return fs.existsSync(filename, function (exists) {
        return exists;
    });
}

function readAssetFile(filename) {
    // Read data from asset file
    return fs.readFileSync(filename, 'utf8', function(err, data) {
        if (err) {
            errorMessage('Error reading asset file.');
        }
        return data;
    });
}

function writeAssetsFile(data, filename) {
    // Write data to asset file
    fs.writeFileSync(filename, JSON.stringify(data));
}

function resetAssetFile(bundlename, filename) {
    // Check if asset file exists
    var doesFileExist = checkAssetFile(filename);

    if(doesFileExist){
        // Read asset file contents
        var contents = readAssetFile(filename);

        // Copy data into file list
        fileList = JSON.parse(contents);

        // Reset or create array for each bundle
        fileList[bundlename] = [];
    }
    else{
        // Create empty file list
        fileList = {};
    }

    // Write file list to asset file
    writeAssetsFile(fileList, filename);
}


// Plugin function
module.exports = function(options) {
    // Reset file list
    var fileList;

    // Prepare options
    options = options || {};
    options.assetFile = options.assetFile || 'assets.json';

    if(!options.bundleName){
        errorMessage('A bundle name is required. Please refer to the docs.');
    }

    if (options.log) {
        gutil.log('Preparing bundle:', gutil.colors.green(options.bundleName));
    }

    // Reset asset file
    resetAssetFile(options.bundleName, options.assetFile);

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
        var contents = readAssetFile(options.assetFile);

        // Copy data into file list
        fileList = JSON.parse(contents);

        // Retrieve filename
        var filename = path.basename(file.path);

        // Add filename to fileList
        if (!fileList[options.bundleName]){
            fileList[options.bundleName] = [];
        }

        fileList[options.bundleName].push(filename);

        // Write list to asset file
        writeAssetsFile(fileList, options.assetFile);

        if (options.log) {
            gutil.log('Wrote filename:', gutil.colors.green(filename));
        }

        callback(null, file);
    });
};