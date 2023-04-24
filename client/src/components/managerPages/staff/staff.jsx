import React from 'react';
import {useEffect, useState} from 'react';
import "./staff.css";
import Navbar from "../managerNavbar/navbar";
import { Link } from 'react-router-dom';
import useFetch from "../hooks/useFetch"
import axios from 'axios';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EditStaffForm from "./editStaffForm";
import AddStaffForm from "./addStaffForm";

const Staff = () => {

    //useFetch Hooks
    const {data:staffData, loading:staffLoading, error:staffError} = useFetch ("http://localhost:4000/api/employee/");

    const [staffDetails, setStaffDetails] = useState()
    const [editableRows, setEditableRows] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [selectedStaff, setSelectedStaff] = useState(null);

    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const handleClose = () => {
      setShow(false);
      setShowAdd(false);
    }

    useEffect(() => {
      setStaffDetails(staffData.map((staff) => {
        return {
          ...staff,
          staffId: staff.staffId,
          staffName: staff.staffName,
          staffNumber: staff.staffNumber,
          staffEmail: staff.staffEmail,
          password: staff.password,
          isManager: staff.isManager
        };
      }));
    }, [staffData]);

    const [formInputs, setFormInputs] = useState({
      staffId: "",
      staffName: "",
      staffNumber: "",
      staffEmail: "",
      password: "",
      isManager: "",
    });

    const handleShow = (staffId) => {
      const selectedStaff = staffDetails.find(staff => staff.staffId === staffId);
      setSelectedStaff(selectedStaff);
      setShow(true);
      if (selectedStaff) {
      setFormInputs({
        staffId: selectedStaff.staffId,
        staffName: selectedStaff.staffName,
        staffNumber: selectedStaff.staffNumber,
        staffEmail: selectedStaff.staffEmail,
        password: selectedStaff.password,
        isManager: selectedStaff.isManager,
      });
    }
    };

    const handleAdd = () => {
      setShowAdd(true);
      if (selectedStaff) {
      setFormInputs({
        staffName: "",
        staffNumber: "",
        staffEmail: "",
        password: "",
        isManager: "",
      });
    }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Update facility details with formInputs values
      setStaffDetails((prevState) => {
      const updatedDetails = [...prevState];
      const index = updatedDetails.findIndex(
          (staff) => staff.staffId === selectedStaff.staffId
      );
      updatedDetails[index].staffId = formInputs.staffId;
      updatedDetails[index].staffName = formInputs.staffName;
      updatedDetails[index].staffNumber = formInputs.staffNumber;
      updatedDetails[index].staffEmail = formInputs.staffEmail;
      //updatedDetails[index].password =  formInputs.password;
      updatedDetails[index].isManager =  formInputs.isManager;

      return updatedDetails;
      });

      // Send updated facility details to server
      axios.put(`http://localhost:4000/api/employee/${selectedStaff.staffId}`, {

        //staffId: formInputs.staffId,
        staffName: formInputs.staffName,
        staffNumber: formInputs.staffNumber,
        staffEmail: formInputs.staffEmail,
        //password: formInputs.password,
        isManager:  formInputs.isManager
        })
        .then(response => {
        console.log(response.data);
        })
        .catch(error => {
        console.log(error);
        alert('Failed to save data')
        });

      // Close modal
      handleClose();
    };
    

    const handleAddSubmit = (event) => {
      event.preventDefault();

      setStaffDetails((prevState) => {
        const updatedDetails = [...prevState];
        
        //updatedDetails[index].staffId = formInputs.staffId;
        updatedDetails.staffName = formInputs.staffName;
        updatedDetails.staffNumber = formInputs.staffNumber;
        updatedDetails.staffEmail = formInputs.staffEmail;
        updatedDetails.password =  formInputs.password;
        updatedDetails.isManager =  formInputs.isManager;
  
        return updatedDetails;
        });
    
      // Send new staff details to server
      axios.post('http://localhost:4000/auth/staff/register', {
        name: formInputs.staffName,
        number: formInputs.staffNumber,
        email: formInputs.staffEmail,
        password: formInputs.password,
        isManager: formInputs.isManager,
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
          alert('Failed to save data');
        });
    
      // Close modal
      handleClose();
    };

    const handleDelete = (staffId) => {
      const selectedStaff = staffDetails.find(staff => staff.staffId === staffId);
      setSelectedStaff(selectedStaff);
      
      if (window.confirm("Are you sure you want to delete this staff member?")) {
        axios.delete(`http://localhost:4000/api/employee/${selectedStaff.staffId}`)
          .then(() => {
            // remove the deleted staff member from staffDetails state
            setStaffDetails(staffDetails.filter(staff => staff.staffId !== selectedStaff.staffId));
            setIsSaved(true); // set a flag to show that the data has been saved
          })
          .catch(err => console.error('Failed to delete staff', err));
      }
    };
    
    

    return(
        <div>
            <Navbar/>
            <EditStaffForm 
              show={show}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              staff={selectedStaff}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <AddStaffForm 
              showAdd={showAdd}
              handleClose={handleClose}
              handleAddSubmit={handleAddSubmit}
              //staff={selectedStaff}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <div  className="staffDetails">
                <h1 className="staffDetailsTitle">GymCorp Staff</h1>
                    <div className="staffDetailsTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Staff name</th>
                                    <th>Staff number</th>   
                                    <th>Staff email</th>
                                    <th>Title</th>
                                    <th></th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffDetails && staffDetails.map(({staffId, staffName, staffNumber, staffEmail, isManager }) => (
                                <tr key = {staffId}>
                                    <td>
                                              <span>{staffName}</span>
                                    </td>
                                    <td>
                                              <span>{staffNumber}</span>
                                    </td>
                                    <td>
                                              <span>{staffEmail}</span>
                                    </td>
                                    <td>
                                    {!isEditable ? (
                                      <span>{isManager ? "Manager" : "Staff"}</span>
                                    ) : (
                                      <select>
                                        <option value={true}>Manager</option>
                                        <option value={false}>Staff</option>
                                      </select>
                                    )}
                                    </td>
                                    {isEditable && (
                                    <td>
                                    <button className="deleteButton" >
                                        Delete
                                    </button>
                                    </td>
                                     )}
                                    <td>
                                    <button className="editStaffButton" onClick={() => {handleShow(staffId);}}>
                                    {editableRows[staffId] ? "Done" : "Edit"}
                                    </button>
                                    </td>
                                    <td>
                                    <button className="editStaffButton" onClick={() => {handleDelete(staffId);}}>
                                    {editableRows[staffId] ? "Delete" : "Delete"}
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            <div>
                              <button className="addButton" onClick={() => { handleAdd();}}>
                                Add
                              </button>
                            </div>
                        </table>
                    </div>
                </div>
        </div>
    )
}

export default Staff;