const { comparePassword } = require("../util");
const { RequestError, CredentialsError } = require("../util/errors");
const StellarHandler = require("../util/stellar");

module.exports = (app, db) => {
  const pay = async (userId, destination, amount) => {
    const stellar = StellarHandler.getInstance();
    if (!stellar.validateAddress(destination)) {
      throw new RequestError("Bad destination address format");
    }
    const user = await db.get("select * from customers where id=$id", {
      $id: userId,
    });
    if (!user) {
      throw new CredentialsError("Bad user supplied");
    }
    if ((user.balance - 0.1) <= amount) {
      throw new RequestError("Not enough balance (should stay minimum 0.1 in balance)");
    }
    console.log({user});

    try{
        const resp = await stellar.payToAddress(destination, amount);

        await db.run(`UPDATE customers SET balance = balance - $amount WHERE id = $id`, {$id:userId, $amount:amount})

        return resp;
    }catch(e){
        console.log(e)
      throw new RequestError("Error occurred");
    }
  };

  app.post("/pay", (req, res, next) => {
    const body = req.body;
    const user = req.user;

    pay(user.id, body.destination, body.amount)
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
