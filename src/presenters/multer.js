const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const filename = (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
        if (err) return cb(err)
        return cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
}

exports.defaultFileDestination = 'public/files/'

exports.defaultStorage = multer.diskStorage({
    destination: this.defaultFileDestination,
    filename
})

exports.setUpload = ({
    storage = null,
    fileFilter = null,
    limits = null,
    preservePath = true,
} = {}) => {
    return multer({
        storage: storage || this.defaultStorage,
        fileFilter,
        limits,
        preservePath,
    })
}
  
exports.getFile = (fieldName = 'file', multerOptions = {}) => {
    return this.setUpload(multerOptions).single(fieldName)
}
