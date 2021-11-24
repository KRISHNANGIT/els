import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

function Body({ reqValue, setReqValue }) {
  return (
    <>
      <nav className="navbar border-bottom">
        <div>
          <select className="selectpicker p-1">
            {/* <option value="none">none</option> */}
            {/* <option value="form-data">form-data</option> */}
            {/* <option value="Headers">x-www-form-urlencoded</option> */}
            <option selected value="raw">
              raw
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
        <span className="nav-text">Beautify</span>
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
