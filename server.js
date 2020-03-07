const URL = "tudbut.glitch.me"

const express = require("express");
const app = express();
const http = require("https");

app.use((req, res) => {
  console.log("Req : " + req.path);
  http.get("https://" + URL + req.originalUrl, {}, (resp, err) => {
    resp.setEncoding("utf8");
    let rawData = "";
    resp.on("data", chunk => {
      rawData += chunk;
    });
    resp.on("end", () => {
      try {
        const parsedData = rawData.repl("https://" + URL, "")
        res.send(parsedData);
        console.log(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.repl = function (s1, s2) {
  return this.split(s1).join(s2);
}