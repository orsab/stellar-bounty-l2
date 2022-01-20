const { comparePassword } = require("../util");
const { RequestError, CredentialsError } = require("../util/errors");
const StellarHandler = require("../util/stellar");

module.exports = (app, db) => {
  const info = async (id) => {
    const user = await db.get("select * from customers where id=$id", {
      $id: id,
    });
    const stellar = StellarHandler.getInstance();
    // const muxedAccount = await stellar.getMuxedAccount(user.id)
    // const balance = await stellar.getBalance(muxedAccount);

    return {
      ...user,
    };
  };

  app.get("/info", (req, res, next) => {
    const user = req.user;
    info(user.id).then((user) => {
      res.json({
        address: user.address,
        balance: user.balance,
      });
    });
  });
};
