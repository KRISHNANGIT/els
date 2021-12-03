export const isExist = (value, urlVal) => {
    console.log({value, urlVal})
    try {
      let origin = new URL(urlVal).origin;
      if (!localStorage.getItem(value)) {
        localStorage.setItem(
          value,
          JSON.stringify({
            [origin]: {
              username: "",
              password: ""
            },
          })
        );
      }
      if(!JSON.parse(localStorage.getItem(value)).hasOwnProperty(origin)){
        let toUpdate = JSON.parse(localStorage.getItem(value))
        console.log({toUpdate})
        localStorage.setItem(value, JSON.stringify({...toUpdate, [origin]:{
          username:"",
          password:""
        }}))
      }
      return JSON.parse(localStorage.getItem(value))[origin]
    } catch {
      return { username:"", password:"" }
    }
  };