const URL = "example.org";

const express = require("express");
const app = express();
const http = require("https");

app.use((req, res) => {
  console.log("Req : " + req.path);
  console.log(req.get("User-Agent"));
  http.get("https://" + URL + req.originalUrl, {headers: {"User-Agent": req.get("User-Agent")}}, (resp, err) => {
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
          parsedData = rawData.repl("https://" + URL, "");
          res.send(parsedData);
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.repl = function(s1, s2) {
  return this.split(s1).join(s2);
};
