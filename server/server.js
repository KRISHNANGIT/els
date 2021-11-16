const express = require('express');
const axios = require('axios');

const app = express()
app.use(express.json())

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const token = `${USERNAME}:${PASSWORD}`;
const encodedToken = Buffer.from(token).toString('base64');
const headers = { 'Authorization': 'Basic '+ encodedToken };


app.post("/count", async(req,res) => {
    console.log({base_url:req.body.base_url})
    const count = await axios.get(req.body.base_url, { headers })
    res.send(count.data)
})

app.post("/search", async(req,res) => {
    const { data, base_url} = req.body
    console.log({ data, base_url})
    const count = await axios.get(base_url, { headers, data })
    res.send(count.data)
})

app.listen(5000)