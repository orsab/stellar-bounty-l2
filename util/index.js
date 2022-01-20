const bcrypt = require("bcrypt");
const fs = require("fs");
const DB_FILE = "./database.db";
const Database = require("sqlite-async");

const cryptPassword = async (password) => {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return rej(err);

      bcrypt.hash(password, salt, function (err, hash) {
        return res(hash);
      });
    });
  });
};

const comparePassword = async (plainPass, hashword) => {
  return new Promise((res) => {
    bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
      res(isPasswordMatch);
    });
  });
};

const initDb = async (db) => {
  let isExist = true;

  if (!fs.existsSync(DB_FILE)) {
    isExist = false;
  }
  db = await Database.open(DB_FILE);

  if (!isExist) {
    await db.run(`
          CREATE TABLE IF NOT EXISTS customers(
              id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              username NVARCHAR(20),
              password NVARCHAR(60),
              address NVARCHAR(70),
              balance REAL DEFAULT 0
              );
              `);
    await db.run(`
              CREATE UNIQUE INDEX username ON customers(username);
              `);
  }

  return db;
};

module.exports = {
  initDb,
  comparePassword,
  cryptPassword,
};
