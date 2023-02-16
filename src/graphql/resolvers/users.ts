const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = mongoose.model.User || require("../../models/User");
const { validateAuthInput } = require("../../utils/validators");
const { generateToken } = require("../../utils/general");
const { UserInputError } = require("apollo-server-express");
const checkAuth = require("../../utils/checkAuth");

import { AuthenticationError } from "apollo-server-express";
import { UserProps } from "../../props";

const saltRounds = 10;

module.exports = {
  Query: {
    async getUser(_: any, {}, req) {
      const { loggedUser } = checkAuth(req);

      const user = await User.findById(loggedUser.id);

      if (user) {
        return user;
      } else {
        throw new Error("User not found");
      }
    },
  },
  Mutation: {
    async login(_: any, { creds }: { creds: UserProps }, req) {
      console.log(`Login request recieved from ${creds.email}`);

      const { errors, valid } = validateAuthInput(creds);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user_ = await User.findOne({
        email: creds.email,
      });

      if (!user_) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(creds.password, user_.password);

      if (!match) {
        errors.general = "Wrong Password";
        throw new AuthenticationError("Password entered is incorrect!", {
          errors,
        });
      }

      const token = generateToken(creds);

      await User.updateOne(
        { _id: user_._id },
        {
          $set: {
            lastLogin: new Date().toISOString(),
          },
        }
      );

      return {
        ...user_._doc,
        id: user_._id,
        token,
      };
    },
    async register(_: any, { creds }: { creds: UserProps }, req) {
      // validate user data
      const { valid, errors } = validateAuthInput(creds);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const hash = await bcrypt
        .genSalt(saltRounds)
        .then((salt) => {
          return bcrypt.hash(creds.password, salt);
        })
        .catch((err) => console.error(err.message));

      const user_ = await User.findOne({
        email: creds.email,
      });

      if (user_) {
        throw new UserInputError("Email Address is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }

      const newUser = new User({
        ...creds,
        password: hash.toString(),
        lastLogin: new Date().toISOString(),
      });

      const res = await newUser.save();

      console.log(`User ${res._id} registered.`);

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
