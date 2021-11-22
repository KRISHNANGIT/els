import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { useState } from "react";
import axios from "axios";
import prettyBytes from "pretty-bytes"
import Body from './Body';
import Auth from './Auth';

const urls = {
  // default: "",
  dev: "https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243",
  test: "https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243test",
};

function App() {
  const [status, setStatus] = useState();
  const [size, setSize] = useState('')
  const [time, setTime] = useState('')
  const [url, setUrl] = useState(urls.dev);
  const [restHead, setRestHead] = useState('Body')
  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })
  const [reqValue, setReqValue] = useState("");
  const [resValue, setResValue] = useState("");
  console.log({restHead})

  const handleSubmit = async () => {
    setResValue("");
    axios.interceptors.request.use(request => {
      request.customData = request.customData || {}
      request.customData.startTime = new Date().getTime()
      return request
    })
  
    function updateEndTime(response) {
      console.log({response})
      response.customData = response.customData || {}
      response.customData.time =
        new Date().getTime() - response.config.customData.startTime
      return response
    }
    
    axios.interceptors.response.use(updateEndTime, e => {
      return Promise.reject(updateEndTime(e.response))
    })
    if (url) {
      const data = JSON.parse(reqValue || null)
      await axios
        .post("/search", { url, data, auth })
        .then((res) => {
          console.log(res?.data?.status)
          setStatus(res.status);
          if(res.data.status) setStatus(res.data.status)
          setResValue(JSON.stringify(res.data, null, 4) || null);
          setSize(prettyBytes(
            JSON.stringify(res.data).length +
              JSON.stringify(res.headers).length
          ))
          setTime(res.customData.time)
        })
        .catch((e) => {
          console.log(e)
          setResValue(e);
        });        
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="input-group mb-4">
        <select
          className="form-select flex-grow-0 w-auto"
          onChange={(e) => setUrl(urls[e.target.value])}
        >
          {/* <option value="default">Default</option> */}
          <option value="dev">Dev</option>
          <option value="test">Test</option>
        </select>
        <select className="form-select flex-grow-0 w-auto">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="url"
          className="form-control"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
      <div className="row border-top border-bottom row-1">
        <div className="col-5 border-end">
          <select onChange={(e) => setRestHead(e.target.value)}>
            <option value="Params">Params</option>
            <option value="Auth">Auth</option>
            <option value="Headers">Headers</option>
            <option selected value="Body">
              Body
            </option>
          </select>
          { restHead === 'Body' && <Body reqValue={reqValue} setReqValue={setReqValue} />}
          { restHead === 'Auth' && <Auth auth={auth} setAuth={setAuth} /> }
        </div>
        <div className="col-7">
          <div className="d-flex justify-content-between my-2">
            <div>Response</div>
            <div className="d-flex justify-content-between">
              <div className="me-4">
                Status: <span data-status>{status}</span>
              </div>
              <div className="me-4">
                Time: <span data-time>{time?`${time}ms`:''}</span>
              </div>
              <div className="me-4">
                Size: <span data-size>{size}</span>
              </div>
            </div>
          </div>
          <div className="border">
            <CodeMirror
              value={resValue}
              height="70vh"
              extensions={[json()]}
              editable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
