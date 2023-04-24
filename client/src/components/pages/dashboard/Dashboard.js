import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react"
import { Link } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import "./Dashboard.css";
import Carousel from "./Carousel";
import {sports} from "./Data";

const Dashboard = () => {
  return (
    <Fragment>
      <Navbar/>
      <div className="first-container">
        <div className="upper-container">
          <Carousel images={sports} height="500px" width="100%" autoPlayDuration={3000} />
          <div className="quote-container">
            <p>Welcome to GymCorp</p>
          </div>
          <div className="bottom-container">
            <Link to="/climbingwall" className="dashItem">
              <img className="dashImage" alt="" src="https://cdn.pixabay.com/photo/2013/03/20/14/47/sports-hall-95270_960_720.jpg"/>
              <div className="dashName">
                <p>Book a Facility</p>
              </div>
            </Link>
            <Link to="/climbingwall" className="dashItem">
              <img className="dashImage" alt="" src="https://cdn.pixabay.com/photo/2022/08/13/12/13/yoga-7383498_960_720.jpg"/>
              <div className="dashName">
                <p>Book a Class</p>
              </div>
            </Link>
            <Link to="/pricing" className="dashItem">
              <img className="dashImage" alt="" src="https://cdn.pixabay.com/photo/2019/08/05/12/10/sunset-4385923_960_720.jpg"/>
              <div className="dashName">
                <p>Buy a Membership</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-item">
          <h2 style={{color: "#fa991c"}}>CONTACT US</h2>
          <ul>
            <li>Phone: (123) 456-7890</li>
            <li>Email: info@gymcorp.com</li>
          </ul>
        </div>
        <div className="footer-item">
          <h2 style={{color: "#fa991c"}}>OPENING TIMES</h2>
          <ul>
            <li>8:00am - 10:00pm</li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;