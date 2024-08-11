import React, {useEffect, useState, useContext} from "react";
import UserContext from "../auth/UserContext";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

function NavBar() {
  const {user} = useContext(UserContext)
  const [nav, setNav] = useState()

  useEffect(() => {
    function getNav() {
      let nav = (user || localStorage.loginToken) ? loggedInNav() : loggedOutNav()
      if (process.env.NODE_ENV === "test" && localStorage.username) nav = loggedInNav()
      setNav(nav)
    }
    getNav()
  }, [user, localStorage.username])


  function loggedInNav() {
    return (
      <div>
      <Navbar expand="md">
        <NavLink to="/" className="navbar-brand">
          Home
        </NavLink>

        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink to="/spells">Spells</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/items">Items</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={`/characters`}>Characters</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={`/profile/${user}`}>Profile</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/logout">Logout</NavLink>
          </NavItem>
        </Nav>

      </Navbar>
    </div>
    )
  }

  function loggedOutNav() {
    return (
      <div>
        <Navbar expand="md">
          <NavLink to="/" className="navbar-brand">
            Home
          </NavLink>

          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink to="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/signup">Signup</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }

  if (!nav) return <h1 className="white"></h1>

  return (
    <>
      {nav}
    </>
  );
}

export default NavBar;
