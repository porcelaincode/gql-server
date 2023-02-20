import { UserProps } from "../props";

const jwt = require("jsonwebtoken");

async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
module.exports.asyncForEach = asyncForEach;

function log(str: string) {
  if (process.env.NODE_ENV === "production") {
    console.log(log);
  }
}
module.exports.log = log;

function generate(n: number): string {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
  var data: string;
  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;
  data = ("" + number).substring(add);
  return data;
}
module.exports.generateOTP = generate;

function generateToken(user: UserProps) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}
module.exports.generateToken = generateToken;
