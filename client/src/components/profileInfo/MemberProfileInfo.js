import React,{Fragment, useState, useEffect, useContext} from "react";
import "./memberProfileInfo.css";
import {Auth} from "../../context/Auth"
import {Link} from "react-router-dom";
import axios from "axios";

export default function MemberProfileInfo() {
    
    const {user} = useContext(Auth);
    //State to fetch user data
    const [userData, setUserData] = useState({});
    // State: Edit mode for update profile
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(()=>{
        const fetchData = async () => {
            const result = await axios.get("/customer/find/:id");
            setUserData(result.data);
        };
        fetchData();
    },[]);

    const handleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsEditMode(false);
        // code to save changes
    };


    return (
        <Fragment>
                <div className="editInfo">
                    <form className="userDetailsForm" onSubmit={handleFormSubmit}>
                        <span className="editInfoTitle">Update Info</span>
                        <div className="userDetails"> 
                            <label>Name</label>
                            {isEditMode ? ( <input type="text" defaultValue={userData.name} /> ) : 
                            (
                                <p>{userData.name}</p>
                            )}
                            <label>Email</label>
                            {isEditMode ? ( <input type="email" defaultValue={userData.email} /> ) : 
                            (
                                <p>{userData.email}</p>
                            )}
                            <label>Number</label>
                            {isEditMode ? ( <input defaultValue={userData.number} />) : 
                            (
                                <p>{userData.number}</p>
                            )}
                            {isEditMode && (
                            <div className="editModePassword">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" defaultValue="" />
                                <label htmlFor="retypePassword">Re-type Password</label>
                                <input id="retypePassword" type="password" defaultValue="" />
                            </div>
                            )}
                            {!isEditMode && (
                                <div className="membershipDetails">
                                    <label>Membership</label>
                                    <p className="membershipDetails">Type: Annual</p>
                                    <p className="membershipDetails">Start: 19/03/2023</p>
                                    <p className="membershipDetails">End: 19/03/2024</p>
                                </div>
                            )}

                        </div>
                        {isEditMode && <button className="updateProfileButton" type="submit">Update</button>}
                        {!isEditMode && <button className="editProfileButton" onClick={handleEditMode}>Edit Profile</button>}
                        {!isEditMode && <button className="cancelMembershipButton">Cancel membership</button>}
                    </form>
            </div>
        </Fragment>
  )
}
