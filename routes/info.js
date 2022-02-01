const { RequestError } = require("../util/errors");

module.exports = (app, db) => {
  const info = async (id) => {
    const user = await db.get("select * from customers where id=$id", {
      $id: id,
    });

    if (!user) {
      return null;
    }
    // const stellar = StellarHandler.getInstance();
    // const muxedAccount = await stellar.getMuxedAccount(user.id)
    // const balance = await stellar.getBalance(muxedAccount);

    return {
      ...user,
    };
  };

  app.get("/info", (req, res, next) => {
    const user = req.user;
    info(user.id)
    .then((user) => {
      if (!user) {
        throw new RequestError("User not found");
      } else {
        res.json({
          address: user.address,
          balance: user.balance.toFixed(7),
          username: user.username,
        });
      }
    })
    .catch(e => {
      if(e instanceof RequestError){
        res.status(400).json({error:e.message})
      }
      else{
          res.status(500).json({error:e.message})
      }
    })
  });
};
