const { create, findOne } = require("..");

exports.createAdmin = ({ username, password }) => create('Admin', { username, password })
exports.findAdminByUsername = username => findOne('Admin', { username })
exports.findAdminById = _id => findOne('Admin', { _id })
