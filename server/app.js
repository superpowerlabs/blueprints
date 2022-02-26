const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const cookieParser = require("cookie-parser");
const Logger = require("./lib/Logger");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const apiV1 = require("./routes/apiV1");

process.on("uncaughtException", function (error) {
  Logger.error(error.message);
  Logger.error(error.stack);

  // if(!error.isOperational)
  //   process.exit(1)
});

let indexText;

function getIndex() {
  if (!indexText) {
    indexText = fs.readFileSync(
      path.resolve(__dirname, "../public/index.html"),
      "utf-8"
    );
  }
  return indexText;
}

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 60,
});

app.use(limiter);

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use("/api/v1", apiV1);

app.use("/index.html", function (req, res) {
  res.redirect("/");
});

app.use("/healthcheck", function (req, res) {
  res.send("ok");
});

app.use("/:anything", function (req, res, next) {
  let v = req.params.anything;
  switch (v) {
    case "favicon.png":
    case "favicon.ico":
    case "styles":
    case "images":
    case "bundle":
      next();
      break;
    default:
      res.send(getIndex());
  }
});

app.use(express.static(path.resolve(__dirname, "../public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      title: "Error",
      message: err.message,
      error: err,
    });
  });
}

// error handler
app.use(function (err, req, res, next) {
  if (err.status !== 404) {
    console.debug(err);
    console.debug(err.status);
    console.debug(err.message);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: "Error" });
});

module.exports = app;
