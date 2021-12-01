import React from "react";

function Headers({ auth }) {
  const { username: USERNAME, password: PASSWORD } = auth;
  return (
    <div className="inner" style={{"height": "70vh"}}>
      <p className="mt-2 mb-0 content">Headers</p>
      <table className="table table-bordered m-0">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">KEY</th>
            <th scope="col">VALUE</th>
            {/* <th scope="col">DESCRIPTION</th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input type="checkbox" id="checkbox" checked />
            </td>
            <td>
              <input
                readOnly
                type="text"
                size="auto"
                name="key"
                value="Authorization"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                size="auto"
                name="value"
                value={`Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString(
                  "base64"
                )}`}
              />
            </td>
            {/* <td className="d-flex justify-content-between"> */}
            {/* <input type="text" size="35" name="description" /> */}
            {/* <span id="remove">x</span> */}
            {/* </td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Headers;
