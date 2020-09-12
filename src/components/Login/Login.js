import React, { useState } from 'react';
import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import { createUserWithEmailAndPassword, handleFBLogin, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';

//  firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser,setNewUser] = useState(false);
  const [user,setUser] = useState({
     inSignedIn: false,
     
     name:'',
     email:'',
     password:'',
     photo:''
    
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let {from} = location.state || {from: {pathname: "/"} };
  
  const googleSignIn = () => {
    handleGoogleSignIn ()
    .then(res => {
      handleResponse(res,true);
    })
  }

  const fbLogin = () => {
    handleFBLogin()
    .then(res => {
      handleResponse(res,true);
    })

  }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res,false);
    })
  }

  const handleResponse = (res , redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }

  const handleBlur = (e) => {
     
    let isFormValid =true;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }

    if(e.target.name === 'password'){ 
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){ 
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  
  }

  const handleSubmit =(e) => {
     if(newUser && user.email && user.password){
       createUserWithEmailAndPassword(user.name, user.email, user.password)
       .then(res => {
        handleResponse(res,true);
       })
     }

     if(!newUser && user.email && user.password){
        signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          handleResponse(res,true);
         })
     }
     e.preventDefault();
  }

  

  return (
    <div style={{textAlign:'center'}}>
       {
         user.isSignedIn ? <button onClick={signOut}>Sign out</button> :
         <button onClick={googleSignIn}>Sign in</button>
       }

       <br/>
       <button onClick={fbLogin}>Sign in using Facebook</button>

      {
        user.isSignedIn &&
         <div>
          <p> Welcome,{user.name}</p>
          <p>your mail:{user.email}</p>
          <img src={user.photo} alt=""></img>
         </div>
      }
 

      <h1>Our own Authentication</h1> 
      <input type="checkbox" onChange={() => setNewUser(!newUser) } name="newUser" id=""/>
      <label htmlFor="newUser">New user Sign up</label>
       
      <form onSubmit={handleSubmit}>
        { newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name"/> }
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="enter your email"/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="your password"/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      { user.success &&  <p style={{color:'green'}}>User Created succesfully</p>}
      
    </div>
  );
}

export default Login;
