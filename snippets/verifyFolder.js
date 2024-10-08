const fs = require('fs');

function verifyFolderName(folderName) {
    // Check if folder name is empty or only contains whitespace
    if (!folderName || !folderName.trim()) {
        return false;
    }

    // Allow only alphanumeric characters
    const alphanumeric = /^[a-zA-Z0-9]+$/;

    // Check if the folder name contains only alphanumeric characters
    if (!alphanumeric.test(folderName)) {
        return false;
    }

    // Check if folder already exists
    if (fs.existsSync(folderName)) {
        return false;
    }

    return true;
}

module.exports = verifyFolderName;
