const express = require("express");
const router = express.Router();
const DiscordOauth2 = require("discord-oauth2");
const crypto = require("crypto");
const queryString = require("query-string");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let baseUri;
let redirectUri;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

router.get("/discord/login", (req, res) => {
  baseUri =
    req.hostname === "arg.mob.land"
      ? "https://arg.mob.land"
      : "http://localhost:8773";
  redirectUri = `${baseUri}/auth/discord/callback`;
  const oauth = new DiscordOauth2({
    clientId,
    clientSecret,
    redirectUri,
  });
  const url = oauth.generateAuthUrl({
    scope: ["identify", "guilds"],
    state: crypto.randomBytes(16).toString("hex"),
  });
  res.redirect(url);
});

router.get("/discord/callback", async (req, res) => {
  if (!req.query.code) {
    return res.redirect("/whoops");
  }
  const code = req.query.code;
  try {
    const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        scope: "identify",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const oauthData = await oauthResult.json();
    const { access_token } = oauthData;
    if (access_token) {
      const oauth = new DiscordOauth2();
      const user = await oauth.getUser(access_token);
      user.access_token = access_token;
      const search = queryString.stringify(user);
      res.redirect("/dark-night-black-background?" + search);
    } else {
      res.redirect("/dark-night-black-background?login=failed");
    }
  } catch (error) {
    return res.redirect(
      "/dark-night-black-background?" +
        queryString.stringify({
          error: "Discord authentication failed or canceled",
        })
    );
  }
});

module.exports = router;
