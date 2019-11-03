const firebaseStorage = require('./firebase-storage');
const storageRef = firebaseStorage.storage().bucket();

function upload(filePath, destination) {
    const options = {
        destination: destination
    };
    return new Promise((resolve, reject) => {
        storageRef.upload(filePath, options, (err, file, apiResponse) => {
            if (err) {
                console.log(err);
            }
            const metadata = file.metadata;
            const url = `https://storage.googleapis.com/${metadata.bucket}/${metadata.name}`;
            // console.log(url);
            return resolve(url);
        });
    });
}

module.exports = {
    upload
};
