import "./App.css";
import React, { useState } from "react";
import axios from "axios";

const USERNAME = "elastic";
const PASSWORD = "V8GOERQioF2r08uMcjGE1gtp";
const token = `${USERNAME}:${PASSWORD}`;
const encodedToken = Buffer.from(token).toString("base64");
// const headers = {
//   Authorization: "Basic " + encodedToken,
// };

const App = () => {
  const url = {
    dev: "https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243",
    test: "https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243test",
  };
  const [env, setEnv] = useState(url.dev);
  const [index, setIndex] = useState("dfr.shipment");
  const [operation, setOperation] = useState("_count");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState();
  const [resp, setResp] = useState();

  const base_url = `${env}/${index}/${operation}`;

  const handleChange = (e) => {
    setEnv(url[e.target.value]);
  };

  const handleIndex = (e) => {
    setIndex(e.target.value);
  };

  const handleOperation = (e) => {
    setOperation(e.target.value);
  };

  const handleMethod = (e) => {
    setMethod(e.target.value);
  };

  const handleBody = (e) => {
    setBody(e.target.value);
  };

  const handleSend = async () => {
    console.log({ body: JSON.parse(body) });
    if(operation === '_count'){
      await axios
        .get('/count')
        .then((res) => {
          console.log(res)
          setResp(JSON.stringify(res.data, null, "\t"))
        })
        .catch((e) => setResp(e));
    } else{
      await axios
        .post("/search",  JSON.parse(body))
        .then((res) => setResp(JSON.stringify(res.data, null, 4)))
        .catch((e) => setResp(e));
    }
  };

  return (
    <div className="App">
      <div className="row-1">
        <div>
          <label>Index:</label>

          <select onChange={handleIndex}>
            <option value="dfr.shipment">dfr.shipment</option>
            <option value="dfr.orderhitory">dfr.orderhitory</option>
            <option value="dfr.customer">dfr.customer</option>
          </select>
        </div>
        <select onChange={handleChange}>
          <option value="dev">Dev</option>
          <option value="test">Test</option>
        </select>
        <div>
          <label>method:</label>

          <select onChange={handleMethod}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div>
          <label>Operation:</label>

          <select onChange={handleOperation}>
            <option value="_count">Count</option>
            <option value="_search">Search</option>
          </select>
        </div>
      </div>
      <div className="url">
        <label>url:</label>
        <input id="url" type="text" value={base_url} placeholder={base_url} />
        <button onClick={handleSend}>send</button>
      </div>
      <div className="row-2">
        <div className="body">
          <label>body:</label>
          <br />
          <textarea
            rows="20"
            cols="40"
            value={body}
            onChange={handleBody}
          ></textarea>
        </div>
        <div className="response">
          <label>response:</label>
          <br />
          <textarea rows="90" cols="100"  value={resp}></textarea>
        </div>
      </div>
    </div>
  );
};

export default App;
