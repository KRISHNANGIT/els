import React from "react";

function Params({ qpList, setQpList, queryParam, url, setUrl }) {
  const urlObject = new URL(new URL(url).origin);

  const addQueryParam = (paramsList) => {
    paramsList
      .filter((li) => li.checked)
      .forEach((param) => {
        if (param.key || param.value)
          urlObject.searchParams.set(param.key, param.value);
      });
  };

  const addNewRow = (e, index) => {
    console.log({ e, index });
    const tempList = [...qpList];
    tempList[index] = {
      ...tempList[index],
      checked: true,
      [e.target.name]: e.target.value,
    };
    if (!qpList[index + 1]) {
      tempList.push(queryParam);
    }
    console.log(tempList);
    // tempList.filter(li => li.checked === true).forEach(param => {
    //   if(param.key || param.value)
    //   urlObject.searchParams.set(param.key,param.value)
    // })
    addQueryParam(tempList);
    setQpList(tempList);
    setUrl(urlObject);
  };

  const removeRow = async (index) => {
    console.log(index);
    if (qpList.length > 0) {
      let rows = [...qpList];
      rows.splice(index, 1);
      addQueryParam(rows);
      setQpList(rows);
      setUrl(urlObject)
    }
  };

  const handleCheck = (index) => {
    // console.log({ hCINdex: index });
    let rows = [...qpList];
    rows[index].checked = !rows[index].checked;
    addQueryParam(rows);
    setQpList(rows);
    setUrl(urlObject)
  };

  console.log(qpList);
  return (
    <div style={{"height":"70vh"}}>
      <p className="mt-2 mb-0">Query Params</p>
      <table className="table table-bordered m-0">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">KEY</th>
            <th scope="col">VALUE</th>
            <th scope="col">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {qpList.map((qp, index) => {
            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={qp.checked}
                    onClick={() => handleCheck(index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    size="3"
                    name="key"
                    value={qp.key}
                    onChange={(e) => addNewRow(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    size="3"
                    name="value"
                    value={qp.value}
                    onChange={(e) => addNewRow(e, index)}
                  />
                </td>
                <td className="d-flex justify-content-between">
                  <input
                    type="text"
                    size="35"
                    name="description"
                    value={qp.description}
                    onChange={(e) => addNewRow(e, index)}
                  />
                  <span
                    style={{
                      display: qpList.length - 1 > index ? "block" : "none",
                    }}
                    onClick={() => removeRow(index)}
                    id="remove"
                  >
                    x
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Params;
