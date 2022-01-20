const { comparePassword } = require("../util");
const { RequestError, CredentialsError } = require("../util/errors");
const jwt = require('jsonwebtoken');

module.exports = (app, db) => {
    const login = async (username, password) => {
        if(!username || !password || password.length < 4 || username.length < 2){
            throw new RequestError("Bad credentials format");
        }

        const res = await db.get("select * from customers where username = $username", {
          $username: username,
        });

        if (res) {
            const passwordMatch = await comparePassword(password, res.password)
          if (!passwordMatch) {
            throw new CredentialsError("Bad username or password");
          }
      
          return res;
        }
      
        throw new CredentialsError("Bad username or password");
      };

      app.post("/login", (req, res, next) => {
        const body = req.body;
    
        login(
          body.username,
          body.password,
        )
        .then(({password, ...user}) => {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '7d' });
            user.access_token = token
            res.status(200).send({status:'ok', data:user})
        })
        .catch(e => {
            if(e instanceof RequestError){
                res.status(400).send({error:e.message})
            }
            else if(e instanceof CredentialsError){
                res.status(401).send({error:e.message})
            }
            else{
                res.status(500).send({error:e.message})
            }
        })
      });
}