import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Createpost from './components/screens/Createpost';
import UserProfile from './components/screens/UserProfile';
import FollowedUsersPosts from './components/screens/FollowedUsersPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)

  useEffect( () => {
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user) {
      dispatch({type: "USER", payload: user})
    }
    else {
      if(!history.location.pathname.startsWith('/reset'))
        history.push('/signin')
    }
  }, [])

  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>        

      <Route path="/signin">
        <Signin />
      </Route>

      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>

      <Route path="/createpost"> 
        <Createpost />
      </Route>

      <Route path="/profile/:userId"> 
        <UserProfile />
      </Route>

      <Route path="/followedusersposts"> 
        <FollowedUsersPosts />
      </Route>

      <Route exact path="/reset"> 
        <Reset />
      </Route>

      <Route path="/reset/:token"> 
        <NewPassword />
      </Route>
    </Switch>
  )
} 

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>    
    </div>
  );
}

export default App;
