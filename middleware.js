const morgan = require("morgan");

const notFoundRoute = (_req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const requestLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    JSON.stringify(req.body),
  ].join(" ");
});

const errorHandler = (error, _req, res, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { notFoundRoute, requestLogger, errorHandler };
