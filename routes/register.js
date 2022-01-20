const {cryptPassword} = require('../util');
const { RequestError } = require('../util/errors');
const StellarHandler = require('../util/stellar');

module.exports = (app, db) => {
  const register = async (username, password) => {
    if(!username){
        throw new RequestError("Bad username");
    }
    if (!password || password.length < 5) {
      throw new RequestError("Bad password supplied");
    }
    const pass = await cryptPassword(password);

    return await db.run(
      `INSERT INTO customers (password, username) VALUES (?,?)`,
      [pass, username]
    );
  };

  app.post("/register", (req, res, next) => {
    const body = req.body;

    register(
      body.username,
      body.password,
    )
    .then(result => {
        const userId = result.lastID
        const stellar = StellarHandler.getInstance()
        stellar.initCustomer(userId)
            .then((address) => {
                db.run(`UPDATE customers SET address = $address WHERE id = $id`, {$id:userId, $address:address.accountId()})
                .then(()=>{
                    res.status(204).send({status:'ok',data:result.lastID})
                })
                .catch(next)
            })
    })
    .catch(e => {
        if(e instanceof RequestError){
            res.status(400).send({error:e.message})
        }
        else if(e.message.includes('SQLITE_CONSTRAINT')){
            res.status(409).send({error:e.message})
        }
        else{
            res.status(500).send({error:e.message})
        }
    })
  });
};
