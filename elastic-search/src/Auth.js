import React, { useState, useEffect, useRef } from "react";

function Auth({auth, setAuth}) {
    const { username, password } = auth

    const [show, setShow] = useState(false)
    const passwordRef = useRef(null)

    useEffect(() => {
        passwordRef.current.type = !show ? 'password' : 'text'
    }, [show])

    const handleAuth = (e) => {
      localStorage.setItem([e.target.name], e.target.value)
        setAuth({
            ...auth,
            [e.target.name]: e.target.value
        })
    }

  return (
    <div className="p-2 border-bottom">
      <div className="border-top border-bottom my-3">
        <div className="m-3">
          <label>TYPE</label>
          <select className="form-select">
            <option value="Basic">Basic</option>
          </select>
        </div>
      </div>
      <form className="d-flex flex-column ms-3">
        <div className="m-1">
          <label>Username</label>
          <input className="ms-5" type="text" name='username' value={username} onChange={handleAuth} />
        </div>
        <div className="m-1">
          <label>Password&nbsp;</label>
          <input className="ms-5" type="password" name='password' value={password} onChange={handleAuth} ref={passwordRef} />
        </div>
        <div className='ms-5'>
          <input type="checkbox" onClick={()=>setShow(!show)}/>
          <label className='ms-2'>Show Password</label>
        </div>
        <div className='ms-5'>
          <input type="button" value="Clear Password" onClick={()=>{
            localStorage.clear()
            setAuth({
              username:'',
              password: ''
            })
          }}
          />
        </div>
      </form>
    </div>
  );
}

export default Auth;
