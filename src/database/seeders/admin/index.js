const { hash } = require('../../../presenters/encryptation')

module.exports = models => {
    const { ADMIN_INITIAL_USERNAME, ADMIN_INITIAL_PASSWORD } = process.env
    models['Admin'].findOne({ username: ADMIN_INITIAL_USERNAME }).then(admin => {
        if (!admin) {
            (new models['Admin']({
                username: ADMIN_INITIAL_USERNAME,
                password: hash(ADMIN_INITIAL_PASSWORD)
            })).save()
        }
    })
}
