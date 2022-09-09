require("dotenv").config();
const { validator, localValidator } = require("./env");
import { ethers } from "ethers";
const [, , hash, nodeEnv] = process.argv;
const signingKey = new ethers.utils.SigningKey(
  nodeEnv === "development" ? localValidator : validator
);
const signedDigest = signingKey.signDigest(hash);
console.info(ethers.utils.joinSignature(signedDigest));
