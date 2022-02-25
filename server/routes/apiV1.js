const express = require("express");
const router = express.Router();
const requireOrMock = require("require-or-mock");
const ethers = require("ethers");
const sigUtil = require("eth-sig-util");
const DiscordOauth2 = require("discord-oauth2");
const dbManager = require("../lib/DbManager");
const Address = require("../../client/utils/Address");
const { signPackedData } = require("../lib/utils");

const env = requireOrMock("env.js", { solutions: {} });
const { validatorAddress, localValidatorAddress } = require("../../env");
const signer =
  process.env.NODE_ENV === "development"
    ? localValidatorAddress
    : validatorAddress;

async function isDiscordAccessTokenValid(accessToken, userId) {
  try {
    const oauth = new DiscordOauth2();
    const user = await oauth.getUser(accessToken);
    if (user && user.id === userId) {
      return true;
    }
  } catch (error) {}
  return false;
}

function isValidSolution(solution, step) {
  return (
    env.solutions[step].toLowerCase().replace(/\s/g, "").replace(/í/, "i") ===
    solution.toLowerCase().replace(/\s/g, "").replace(/í/, "i")
  );
}

router.post("/verify-solution", async (req, res) => {
  const connectedWallet = req.get("Connected-wallet");
  const msgParams = JSON.parse(req.body.msgParams);
  let recovered = ethers.constants.AddressZero;
  if (connectedWallet === recovered) {
    return res.json({
      success: false,
      error: "Invalid wallet",
    });
  }
  try {
    recovered = sigUtil.recoverTypedSignature_v4({
      data: msgParams,
      sig: req.body.signature,
    });
  } catch (e) {}
  if (Address.equal(recovered, connectedWallet)) {
    const data = JSON.parse(msgParams.message.data);
    const { solution, accessToken, step, discordId } = data;
    if (!(await isDiscordAccessTokenValid(accessToken, discordId))) {
      return res.json({
        success: false,
        error: "Invalid discord access token",
      });
    }
    if (step.toString() !== "1") {
      return res.json({
        success: false,
        error: "Not the right step",
      });
    }
    if (isValidSolution(solution, step)) {
      let data = await dbManager.newWhitelisted(
        step,
        connectedWallet,
        discordId
      );
      if (data) {
        const { id: rank, created_at } = data[0];
        const receipt = {
          rank,
          discord_id: discordId,
          wallet: connectedWallet,
          is_winner: rank <= 30,
          step,
          created_at,
          signer,
        };
        const hash = ethers.utils.id(JSON.stringify(receipt));
        const signature = signPackedData(hash);
        receipt.hash = hash;
        receipt.signature = signature;
        await dbManager.updateWhitelist(step, rank, receipt);
        return res.json({
          success: true,
          receipt,
        });
      } else {
        return res.json({
          success: false,
          error: "Wallet or discord user already got whitelisted",
        });
      }
    } else {
      return res.json({
        success: false,
        error: "Nope, wrong solution",
      });
    }
  } else {
    return res.json({
      success: false,
      error: "Wrong signature",
    });
  }
});
module.exports = router;
