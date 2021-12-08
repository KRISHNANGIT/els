import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";

function Body({ reqValue, setReqValue }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClipboard = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const beautify = () => {
    setReqValue(JSON.stringify(JSON.parse(reqValue), null, 2) || null);
  };

  return (
    <div style={{ height: "70vh" }}>
      <nav className="navbar">
        <div>
          <select className="selectpicker">
            <option selected value="raw">
              RAW
            </option>
          </select>
          <select className="ms-1">
            <option selected value="JSON">
              JSON
            </option>
          </select>
        </div>
        <div className="d-flex flex-direction-column">
          <p className="me-2" id="beautify" onClick={beautify}>
            Beautify
          </p>
          <CopyToClipboard
            className="clipboard mt-1"
            text={reqValue}
            onCopy={handleClipboard}
          >
            {isCopied ? (
              <FaClipboardCheck color="green" />
            ) : (
              <FiCopy title="copy to clipboard" />
            )}
          </CopyToClipboard>
        </div>
      </nav>
      <div className="border">
        <CodeMirror
          value={reqValue}
          height="65vh"
          extensions={[json()]}
          onChange={(value, viewUpdate) => {
            setReqValue(value);
          }}
        />
      </div>
    </div>
  );
}

export default Body;
