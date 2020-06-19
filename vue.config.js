const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("common", resolve("./src/common"))
      .set("components", resolve("src/components"))
      .set("api", resolve("src/api"))
      .set("base", resolve("src/base"));
  },
  devServer: {
    before(app) {
      app.get("/api/getDiscList", function(req, res) {
        const url =
          "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg";
        axios
          .get(url, {
            headers: {
              referer: "https://c.y.qq.com/",
              host: "c.y.qq.com"
            },
            params: req.query
          })
          .then(response => {
            res.json(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      });

      app.get("/api/getCdInfo", function(req, res) {
        const url =
          "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg";
        axios
          .get(url, {
            headers: {
              referer: "https://c.y.qq.com/",
              host: "c.y.qq.com"
            },
            params: req.query
          })
          .then(response => {
            let ret = response.data;
            if (typeof ret === "string") {
              const reg = /^\w+\(({.+})\)$/;
              const matches = ret.match(reg);
              if (matches) {
                ret = JSON.parse(matches[1]);
              }
            }
            res.json(ret);
          })
          .catch(e => {
            console.log(e);
          });
      });

      app.get("/api/lyric", function(req, res) {
        const url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";

        axios
          .get(url, {
            headers: {
              referer: "https://c.y.qq.com/",
              host: "c.y.qq.com"
            },
            params: req.query
          })
          .then(response => {
            let ret = response.data;
            if (typeof ret === "string") {
              const reg = /^\w+\(({.+})\)$/;
              const matches = ret.match(reg);
              if (matches) {
                ret = JSON.parse(matches[1]);
              }
            }
            res.json(ret);
          })
          .catch(e => {
            console.log(e);
          });
      });

      app.post("/api/getPurlUrl", bodyParser.json(), function(req, res) {
        const url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
        axios
          .post(url, req.body, {
            headers: {
              referer: "https://y.qq.com/",
              origin: "https://y.qq.com",
              "Content-type": "application/x-www-form-urlencoded"
            }
          })
          .then(response => {
            res.json(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      });

      app.get("/api/search", function(req, res) {
        const url = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";
        axios
          .get(url, {
            headers: {
              referer: "https://c.y.qq.com/",
              host: "c.y.qq.com"
            },
            params: req.query
          })
          .then(response => {
            res.json(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      });
    }
  }
};
