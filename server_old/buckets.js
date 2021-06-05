const {Storage} = require('@google-cloud/storage');

const bucketName = "web-colour-bucket";

const storage = new Storage();

async function uploadFile(filePath, fileName){
    await storage.bucket(bucketName).upload(filePath,{
        destination: fileName
    });
    console.log(`${filePath} uploaded to ${bucketName}`);
}

module.exports = uploadFile;