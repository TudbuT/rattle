const URL =       "www.google.com";
const USE_HTTPS = true;

const express = require("express");
const app = express();
const http = USE_HTTPS ? require("https") : require("http");

app.use((req, res) => {
  console.log("Req : " + req.path);
  console.log(JSON.stringify(req.headers));
  const headers = req.headers;
  headers.host = URL;
  headers.referer = URL;
  headers["x-forwarded-host"] = URL;
  headers["accept-encoding"] = "utf8";

  http.get(
    "http" + (USE_HTTPS ? "s" : "") + "://" + URL + req.originalUrl,
    { headers: headers },
    (resp, err) => {
      resp.setEncoding("utf8");
      let rawData = "";
      resp.on("data", chunk => {
        rawData += chunk;
      });
      resp.on("end", () => {
        try {
          let parsedData;
          if (req.get("Content-Type") == "application/json") {
            parsedData = JSON.parse(rawData);
            res.json(parsedData);
          } else {
            parsedData = rawData.repl(
              "http" + (USE_HTTPS ? "s" : "") + "://" + URL,
              ""
            );
            res.send(parsedData);
          }
        } catch (e) {
          console.error(e.message);
        }
      });
    }
  );
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.repl = function(s1, s2) {
  return this.split(s1).join(s2);
};
