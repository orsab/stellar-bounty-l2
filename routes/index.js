const register = require('./register')
const login = require('./login')
const info = require('./info')
const pay = require('./pay')
const friedbot = require('./friendbot')
const paymentsStream = require('./paymentsStream')
const init = require('./init')

module.exports = (app, db) => {
    init(app, db)
    register(app, db)
    login(app, db)
    info(app, db)
    pay(app, db)
    friedbot(app, db)
    paymentsStream(app, db)
}