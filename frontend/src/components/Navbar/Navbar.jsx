// import React, { useContext, useState } from "react";
// import "./Navbar.css";
// import { assets } from "../../assets/assets";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { StoreContext } from "../../context/StoreContext";

// const Navbar = ({ setShowLogin }) => {
//   const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menu, setMenu] = useState("");
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     navigate("/");
//   };
//   return (
//     <div className="navbar">
//       <Link to="/">
//         <img className="logo" src={assets.logo} alt="logo" />
//       </Link>

//       <ul className="navbar-menu">
//         <NavItem to="/" text="home" currentPath={location.pathname} />
//         <NavItem to="/menu" text="menu" currentPath={location.pathname} />

//         <NavItem
//           to="/contact"
//           text="contact us"
//           currentPath={location.pathname}
//         />
//       </ul>
//       <div className="navbar-right">
//         <img src={assets.search_icon} alt="" />
//         <div className="navbar-search-icon">
//           <Link to="/cart">
//             <img src={assets.basket_icon} alt="" />
//           </Link>
//           <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
//         </div>
//         {!token ? (
//           <button
//             onClick={() => {
//               setShowLogin(true);
//             }}
//           >
//             sign in
//           </button>
//         ) : (
//           <div className="navbar-profile">
//             <img src={assets.profile_icon} alt="" />
//             <ul className="nav-profile-dropdown">
//               <li
//                 onClick={() => {
//                   navigate("/myorders");
//                 }}
//               >
//                 <img src={assets.bag_icon} alt="" />
//                 <p>Orders</p>
//               </li>
//               <hr />
//               <li onClick={logout}>
//                 <img src={assets.logout_icon} alt="" />
//                 <p>Logout</p>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const NavItem = ({ to, text, currentPath }) => {
//   return (
//     <li className={to === currentPath ? "active" : ""}>
//       <Link to={to}>{text}</Link>
//     </li>
//   );
// };

// export default Navbar;

import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="logo" />
      </Link>

      <ul className="navbar-menu">
        <NavItem to="/" text="home" currentPath={location.pathname} />
        <NavItem to="/menu" text="menu" currentPath={location.pathname} />
        <NavItem
          to="/contact"
          text="contact us"
          currentPath={location.pathname}
        />
      </ul>

      <div className="navbar-right">
        {token ? (
          <>
            {/* <div className="navbar-search-icon">
              <img src={assets.search_icon} alt="search" />
            </div> */}
            <div className="navbar-cart-icon">
              <Link to="/cart">
                <img src={assets.basket_icon} alt="cart" />
              </Link>
              <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
            </div>
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="profile" />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon} alt="orders" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="logout" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ to, text, currentPath }) => {
  return (
    <li className={to === currentPath ? "active" : ""}>
      <Link to={to}>{text}</Link>
    </li>
  );
};

export default Navbar;
