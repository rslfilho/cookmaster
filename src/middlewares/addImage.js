const multer = require('multer');

const fileFilter = (_req, file, callback) => {
  if (file.mimetype !== 'image/jpeg') {
    return callback({ statusCode: 403, message: 'Extension must be `jpeg`' });
  }

  callback(null, true);
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => { callback(null, './src/uploads'); },
  filename: (req, file, callback) => {
    const { id } = req.params;
    const { mimetype } = file;

    const type = mimetype.split('/')[1];

    callback(null, `${id}.${type}`);
  },
});

module.exports = multer({ storage, fileFilter });