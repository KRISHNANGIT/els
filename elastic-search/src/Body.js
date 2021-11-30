import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";

function Body({ reqValue, setReqValue }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleClipboard = () => {
    setIsCopied(true)
    setTimeout(()=>{
      setIsCopied(false)
    }, 1000)
  }
  return (
    <>
      <nav className="navbar border-bottom">
        <div>
          <select className="selectpicker p-1">
            {/* <option value="none">none</option> */}
            {/* <option value="form-data">form-data</option> */}
            {/* <option value="Headers">x-www-form-urlencoded</option> */}
            <option selected value="raw">
              RAW
            </option>
            {/* <option value="binary">binary</option> */}
            {/* <option value="GraphQL">GraphQL</option> */}
          </select>
          <select className="m-1 p-1">
            {/* <option value="Text">Text</option> */}
            {/* <option value="Javascript">Javascript</option> */}
            <option selected value="JSON">
              JSON
            </option>
            {/* <option value="HTML">HTML</option> */}
            {/* <option value="XML">XML</option> */}
          </select>
        </div>
        <CopyToClipboard className="clipboard" text={reqValue} onCopy={handleClipboard}>
          {isCopied ? <FaClipboardCheck color="green" /> : <FiCopy />}
        </CopyToClipboard>
      </nav>
      <div className="border">
        <CodeMirror
          value={reqValue}
          height="50vh"
          extensions={[json()]}
          onChange={(value, viewUpdate) => {
            setReqValue(value);
          }}
        />
      </div>
    </>
  );
}

export default Body;
