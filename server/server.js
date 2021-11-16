const express = require('express');
const axios = require('axios');

const app = express()
app.use(express.json())

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const token = `${USERNAME}:${PASSWORD}`;
const encodedToken = Buffer.from(token).toString('base64');
const headers = { 'Authorization': 'Basic '+ encodedToken };


app.get("/count", async(req,res) => {
    const BASE_URL="https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243/dfr.shipment/_count"
  
    const count = await axios.get(BASE_URL, { headers })
    res.send(count.data)
})

app.post("/search", async(req,res) => {
    const BASE_URL="https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243/dfr.shipment/_search"
    console.log(req.body)
    const count = await axios.get(BASE_URL, { headers, data: req.body })
    res.send(count.data)
})

app.listen(5000)