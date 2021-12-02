const express = require("express");
const axios = require("axios");
const logger = require("./config/logger");
const fs = require("fs");

const app = express();
app.use(express.json());

// const USERNAME = process.env.USERNAME;
// const PASSWORD = process.env.PASSWORD;
// const token = `${USERNAME}:${PASSWORD}`;
// const encodedToken = Buffer.from(token).toString("base64");
// const headers = { Authorization: "Basic " + encodedToken };

// app.post("/count", async(req,res) => {
//     console.log({username:process.env.USERNAME, password:process.env.PASSWORD})
//     console.log({url:req.body})
//     // const count = await axios.get(req.body.base_url, { headers })
//     const count = await axios({
//         method: 'get',
//         url: req.body.base_url,
//         headers
//     })
//     res.send(count.data)
// })

if (!fs.existsSync("JSON")) {
  fs.mkdirSync("JSON");
  fs.writeFileSync("JSON/urls.json", "[]");
}

if (!fs.existsSync("JSON/urls.json")) {
  fs.writeFileSync("JSON/urls.json", "[]");
}

const getSuggestions = (urls, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0
    ? []
    : urls.filter(
        (sug) => sug.toLowerCase().slice(0, inputLength) === inputValue
      );
};

app.post("/search", async (req, res) => {
  console.log({ search_url: req.body.url, data: req.body.data });
  const { auth, url, data, method } = req.body;
  logger.info(JSON.stringify({ url, data }, null, "\t"));
  // const count = await axios.get(req.body.base_url, { headers, data: req.body.data })
  // try{
  await axios({
    method,
    auth,
    url,
    data,
  })
    .then((response) => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch((e) => {
      res.send(e);
    });
  const urls = new Set(JSON.parse(fs.readFileSync("JSON/urls.json")));
  urls.add(url);
  fs.writeFileSync("JSON/urls.json", JSON.stringify([...urls], null, 2));
  //     res.send(count.data)
  // } catch(e){
  //     // const { config:Config, message } = e
  //     // const { headers, ...config} = Config
  //     // res.send({message, config})
  //     if(e.response)
  //     console.log({e,errStatus:e.response.status})
  //     res.status(e.response.status).send(e)
  // }
});

app.post("/suggestions", async (req, res) => {
  try {
    const urls = JSON.parse(fs.readFileSync("JSON/urls.json"));
    if (urls.length > 0) {
      const suggesions = getSuggestions(urls, req.body.data);
      res.send(suggesions);
    } else {
      res.send([]);
    }
  } catch (e) {
    res.send(e);
  }
});

app.listen(5000, () => {
  console.log("Server listening on PORT 5000");
});
