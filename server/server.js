const express = require('express');
const axios = require('axios');

const app = express()
app.use(express.json())

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const token = `${USERNAME}:${PASSWORD}`;
const encodedToken = Buffer.from(token).toString('base64');
const headers = { 'Authorization': 'Basic '+ encodedToken };


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

app.post("/search", async(req,res) => {
    console.log({search_url:req.body.url, data:req.body.data})
    const { auth, url, data} = req.body
    // const count = await axios.get(req.body.base_url, { headers, data: req.body.data })
    // try{
        await axios({
            method: 'GET',
            auth,
            url,
            data
        }).then(response => {
            console.log(response.data)
            res.send(response.data)
        })
        .catch(e=>{
            res.send(e)
        })
    //     res.send(count.data)
    // } catch(e){
    //     // const { config:Config, message } = e
    //     // const { headers, ...config} = Config
    //     // res.send({message, config})
    //     if(e.response)
    //     console.log({e,errStatus:e.response.status})
    //     res.status(e.response.status).send(e)
    // }
})

app.listen(5000, () => {
    console.log("Server listening on PORT 5000")
})