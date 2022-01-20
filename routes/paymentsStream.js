const { RequestError } = require("../util/errors");
const StellarHandler = require("../util/stellar");

module.exports = (app, db) => {
  const stellar = StellarHandler.getInstance();
  stellar.server
    .payments()
    .forAccount(stellar.custodian.publicKey())
    .cursor("now")
    .stream({
      onmessage: (message) => {
        const {from, to, to_muxed, to_muxed_id, amount} = message

        db.run(`UPDATE customers SET balance = balance + $amount WHERE address = $address`, {$address:to_muxed, $amount:Number(amount)})
            .catch(console.log)
        
      },
    });
};
