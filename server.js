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
        res.send(rawData);
        console.log(rawData)
      } catch (e) {
        console.error(e.message);
      }
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
