const { comparePassword } = require("../util");
const { RequestError, CredentialsError } = require("../util/errors");
const StellarHandler = require("../util/stellar");

module.exports = (app, db) => {
  const friendbot = async (userId) => {
    const stellar = StellarHandler.getInstance();
    const user = await db.get("select * from customers where id=$id", {
      $id: userId,
    });
    if (!user) {
      throw new CredentialsError("Bad user supplied");
    }
    
    const AMOUNT_TO_GIVE = 10

    const resp = await stellar.payToAddress(user.address, AMOUNT_TO_GIVE);
    
    await db.run(`UPDATE customers SET balance = balance + $amount WHERE id = $id`, {$id:userId, $amount:AMOUNT_TO_GIVE})
    return resp;
  };

  app.post("/friendbot", (req, res, next) => {
    const body = req.body;
    const user = req.user;

    friendbot(user.id)
      .then((data) => {
        res.json({ status: "ok", data });
      })
      .catch((e) => {
        if(e instanceof RequestError){
            res.status(400).json({error:e.message})
        }
        else if(e instanceof CredentialsError){
            res.status(409).json({error:e.message})
        }
        else{
            res.status(500).json({error:e.message})
        }
      });
  });
};
