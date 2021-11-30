import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Body from "./Body";
import Auth from "./Auth";
import Params from "./Params";
import Headers from "./Headers";
import { FiCopy } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";

const queryParam = {
  checked: false,
  key: "",
  value: "",
  description: "",
};

const urls = {
  // default: "",
  dev: "https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.com:9243",
  test: "https://31bda3cd72b34dcb85e604b4bcea12b1.eastus2.azure.elastic-cloud.comtest:9243/test",
};

let timer;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState("GET");
  const [status, setStatus] = useState("");
  const [size, setSize] = useState("");
  const [time, setTime] = useState("");
  const [url, setUrl] = useState(urls.dev);
  const [restHead, setRestHead] = useState("Body");
  const [qpList, setQpList] = useState([queryParam]);
  const [auth, setAuth] = useState({
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
  });
  const [reqValue, setReqValue] = useState("");
  const [resValue, setResValue] = useState("");
  const [backUrl, setBackUrl] = useState([]);

  const [timerValue, setTimerValue] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  //clipboard
  const [isCopied, setIsCopied] = useState(false);

  //change method when click back button
  const methodRef = useRef(null);

  useEffect(() => {
    if (timerValue > 0 && startTimer) {
      handleSubmit();
      timer = setInterval(() => {
        handleSubmit();
      }, timerValue * 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [startTimer]);

  const handleSubmit = async () => {
    setResValue("");
    axios.interceptors.request.use((request) => {
      request.customData = request.customData || {};
      request.customData.startTime = new Date().getTime();
      return request;
    });

    function updateEndTime(response) {
      console.log({ response });
      response.customData = response.customData || {};
      response.customData.time =
        new Date().getTime() - response.config.customData.startTime;
      return response;
    }

    axios.interceptors.response.use(updateEndTime, (e) => {
      return Promise.reject(updateEndTime(e.response));
    });
    if (url) {
      const data = JSON.parse(reqValue || null);
      setIsLoading(true);
      await axios
        .post("/search", { url, data, auth, method })
        .then((res) => {
          setIsLoading(false);
          console.log(res);
          let content_type = res.headers["content-type"].split(";")[0];
          setStatus(res.status);
          if (res.data.status) setStatus(res.data.status);
          if (content_type === "text/html") {
            setResValue(res.data || null);
          } else {
            setResValue(JSON.stringify(res.data, null, 4) || null);
          }
          // setResValue(res.data || null);
          setSize(
            prettyBytes(
              JSON.stringify(res.data).length +
                JSON.stringify(res.headers).length
            )
          );
          setTime(res.customData.time);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
          setResValue(e);
        });

      //for backUrl
      const urlSet = new Set([...backUrl]);
      urlSet.add(`${url}____${method}`);
      setBackUrl([...urlSet]);
    }
  };

  const handleUrl = (e) => {
    setUrl(e.target.value);
  };

  const handleEnter = (e) => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      document.getElementById("send").click();
    }
  };

  const handleBackUrl = () => {
    let popedUrl = [...backUrl].filter(
      (url, index) => index !== [...backUrl].length - 1
    );
    console.log({ popedUrl, uri: popedUrl.at(-1).split("____") });
    setUrl(popedUrl.at(-1).split("____")[0]);
    methodRef.current.value = popedUrl.at(-1).split("____")[1];
    setBackUrl(popedUrl);
  };

  const handleStart = (e) => {
    console.log(e);
    let code = e.keyCode || e.which;
    if (code === 13) {
      document.getElementById("start").click();
    }
  };

  const handleClipboard = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className="container-fluid p-4">
      <div className="input-group mb-4">
        <button
          className="btn btn-primary"
          disabled={backUrl.length > 1 ? false : true}
          onClick={handleBackUrl}
        >
          Back
        </button>
        <select
          className="form-select flex-grow-0 w-auto"
          onChange={(e) => setUrl(urls[e.target.value])}
        >
          {/* <option value="default">Default</option> */}
          <option value="dev">Dev</option>
          <option value="test">Test</option>
        </select>
        <select
          className="form-select flex-grow-0 w-auto"
          onChange={(e) => setMethod(e.target.value)}
          ref={methodRef}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="url"
          className="form-control"
          value={url}
          onChange={handleUrl}
          onKeyPress={handleEnter}
        />
        {/* <div
          className="card position-absolute top-100"
          style={{ width: "67rem", zIndex: "1" }}
        >
          <p className='m-0 p-1'>{urls.dev}</p>
          <p className='m-0 p-1'>{urls.dev}</p>
          <p className='m-0 p-1'>{urls.dev}</p>
          <p className='m-0 p-1'>{urls.dev}</p>
          <p className='m-0 p-1'>{urls.dev}</p>
        </div> */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
          id="send"
        >
          {isLoading ? "Sending" : "Send"}
        </button>
      </div>
      {/* <div className="input-group mb-2">
        <input
          className="form-control-sm"
          placeholder="Set Timer"
          disabled={startTimer ? true : false}
          onChange={(e) => setTimerValue(e.target.value)}
          onKeyPress={handleStart}
        />
        {!startTimer ? (
          <button
            className="btn btn-success"
            id="start"
            onClick={() => setStartTimer(true)}
          >
            Start
          </button>
        ) : (
          <button
            className="btn btn-danger"
            onClick={() => {
              setStartTimer(false);
              clearInterval(timer);
            }}
          >
            Stop
          </button>
        )}
      </div> */}
      <div className="row border-top border-bottom row-1">
        <div className="col-5 border-end outer">
          {/* <select onChange={(e) => setRestHead(e.target.value)}>
            <option value="Params">Params</option>
            <option value="Auth">Auth</option>
            <option value="Headers">Headers</option>
            <option selected value="Body">
              Body
            </option>
          </select> */}
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                className={
                  restHead === "Params" ? "nav-link active" : "nav-link"
                }
                onClick={(e) => setRestHead(e.target.innerText)}
              >
                Params
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                className={restHead === "Auth" ? "nav-link active" : "nav-link"}
                onClick={(e) => setRestHead("Auth")}
              >
                Authorization
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                className={
                  restHead === "Headers" ? "nav-link active" : "nav-link"
                }
                onClick={(e) => setRestHead(e.target.innerText)}
              >
                Headers
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                className={restHead === "Body" ? "nav-link active" : "nav-link"}
                onClick={(e) => setRestHead(e.target.innerText)}
              >
                Body
              </button>
            </li>
          </ul>
          {restHead === "Body" && (
            <Body reqValue={reqValue} setReqValue={setReqValue} />
          )}
          {restHead === "Auth" && <Auth auth={auth} setAuth={setAuth} />}
          {restHead === "Params" && (
            <Params
              qpList={qpList}
              setQpList={setQpList}
              queryParam={queryParam}
              url={url}
              setUrl={setUrl}
            />
          )}
          {restHead === "Headers" && <Headers auth={auth} />}
          <div className="input-group mt-2">
        <input
          className="form-control-sm"
          placeholder="Set Timer"
          disabled={startTimer ? true : false}
          onChange={(e) => setTimerValue(e.target.value)}
          onKeyPress={handleStart}
        />
        {!startTimer ? (
          <button
            className="btn btn-success"
            id="start"
            onClick={() => setStartTimer(true)}
          >
            Start
          </button>
        ) : (
          <button
            className="btn btn-danger"
            onClick={() => {
              setStartTimer(false);
              clearInterval(timer);
            }}
          >
            Stop
          </button>
        )}
      </div>
        </div>
        <div className="col-7">
          <div className="d-flex justify-content-between my-2">
            <div>Response</div>
            <div className="d-flex justify-content-between">
              <div className="me-4">
                Status: <span data-status>{status}</span>
              </div>
              <div className="me-4">
                Time: <span data-time>{time ? `${time}ms` : ""}</span>
              </div>
              <div className="me-4">
                Size: <span data-size>{size}</span>
              </div>
              <div className="me-4">
                <CopyToClipboard className="clipboard" text={resValue} onCopy={handleClipboard}>
                  {isCopied ? (
                      <FaClipboardCheck color="green"/>
                  ) : (
                    <FiCopy />
                  )}
                </CopyToClipboard>
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
