const URL =       "www.google.com";
const USE_HTTPS = true;
//                You can change the url while running by requesting "/?&rattle&" and then clicking on "Set URL".

const express = require("express");
const app = express();
const http = USE_HTTPS ? require("https") : require("http");

let useURL = URL;

app.use((req, res) => {
  console.log("REQ: " + req.method + " - " + req.originalUrl);
  console.log(JSON.stringify(req.headers));
  const headers = req.headers;
  headers.host = useURL;
  headers.origin = "http" + (USE_HTTPS ? "s" : "") + "://" + useURL;
  headers.referer = useURL + req.originalUrl;
  headers["x-forwarded-host"] = useURL;
  headers["accept-encoding"] = "utf8";

  const var1 = req.path.split("/")[req.path.split("/").length - 1];
  const useUtf8 = [
    "html",
    "htm",
    "css",
    "js",
    "ts",
    "py",
    "txt",
    "sh",
    "bat",
    "java",
    "xml",
    "php",
    "aspx",
    "json"
  ];
  if (req.query.rattle) {
    if (req.query.rattle.url) {
      useURL = req.query.rattle.url;
      res.send(
        `<meta name="viewport" content="width=device-width height=device-height">Set. <a href="/">Go!</a>`
      );
    }
  } else if (req.originalUrl === "/?&rattle&") {
    res.send(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><a onclick="window.location.href = \'/?rattle[url]=\' + prompt(\'New URL (without HTTP[S])\');">Set URL'
    );
  } else
    try {
      http.get(
        "http" + (USE_HTTPS ? "s" : "") + "://" + useURL + req.originalUrl,
        { method: req.method, headers: headers },
        (resp, err) => {
          res.writeHead(resp.statusCode, resp.headers);
          let rawData = "";
          resp.on("data", chunk => {
            rawData += chunk;
            if (!var1.includes(".") || useUtf8.includes(var1.split(".")[1]))
              chunk = chunk
                .toString()
                .repl("http://" + useURL, "")
                .repl("https://" + useURL, "");
            res.write(chunk);
          });
          resp.on("end", () => {
            console.log("Gotten response!");
            res.end();
          });
        }
      );
    } catch (e) {
      console.error(e.toString());
    }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.repl = function(s1, s2) {
  return this.split(s1).join(s2);
};
