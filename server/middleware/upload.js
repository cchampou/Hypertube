const multer = require('multer');
const mkdirp = require('mkdirp');
const mime = require ('mime');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp('./uploads', err => cb(null, './uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + '.' + mime.getExtension(file.mimetype))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
        cb(null, true);
    else
        cb(null, false);
}

const multerConf = {
    storage,
    limits: {
        fieldSize: 1024 * 1024 * 6
    },
    fileFilter
};

module.exports = multerConf;