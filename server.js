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
  
  let var1 = req.path.split("/")[req.path.split("/").length - 1];
  
http.get("http" + (USE_HTTPS ? "s" : "") + "://" + URL + req.originalUrl, { headers: headers }, (resp, err) => {
    if (
      !var1.includes(".") ||
      (!["html", "htm", "css", "js", "ts", "py", "txt", "sh", "bat"].includes(var1.split(".")[1]) && var1)
    )
      resp.setEncoding("utf8");
    let rawData = "";
    resp.on("data", chunk => {
      rawData += chunk;
      if (
        !var1.includes(".") ||
        (!["html", "htm", "css", "js", "ts", "py", "txt", "sh", "bat"].includes(var1.split(".")[1]) && var1)
      )
        chunk = chunk
          .toString()
          .repl("http://" + URL, "")
          .repl("https://" + URL, "");
      res.write(chunk);
    });
    resp.on("end", () => {
      console.log("Gotten response!");
      res.end();
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.repl = function(s1, s2) {
  return this.split(s1).join(s2);
};
