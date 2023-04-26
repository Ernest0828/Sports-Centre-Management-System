import React from 'react';
import {useEffect, useState} from 'react';
import "./classDetails.css";
import Navbar from "../../managerNavbar/navbar";
import { Link } from 'react-router-dom';
import useFetch from "../../hooks/useFetch"
import axios from 'axios';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EditClassForm from "./editClassForm";
import AddClassForm from "./addClassForm";


const ClassDetails = () => {

    //useFetch Hooks
    const {data:classData, loading:classLoading, error:classError} = useFetch ("http://localhost:4000/api/classes/");

    const [classDetails, setClassDetails] = useState()
    const [editableRows, setEditableRows] = useState({});
    const [isEditable, setIsEditable] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);

    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const handleClose = () => {
      setShow(false);
      setShowAdd(false);
    }

    useEffect(() => {
      setClassDetails(classData.map(({ classId, className, price, day, startTime, endTime, facilityName }) => {
        return {
          classId,
          className,
          price,
          dayTime: [{ day, startTime, endTime }],
          facilityName
        };
      }));      
    }, [classData]);

    const [formInputs, setFormInputs] = useState({
      className: "",
      price: "",
      day: "",
      startTime: "",
      endTime: "",
      facilityName:""
    });

    const handleShow = (classId) => {
      const selectedClass = classDetails.find(classes => classes.classId === classId);
      setSelectedClass(selectedClass);
      setShow(true);

      if (selectedClass) {
      setFormInputs({
        classId: selectedClass.classId,
        className: selectedClass.className,
        price: selectedClass.price,
        day: selectedClass.dayTime[0].day, // set the day value from the dayTime array
        startTime: selectedClass.dayTime[0].startTime, // set the startTime value from the dayTime array
        endTime: selectedClass.dayTime[0].endTime,
        facilityName: selectedClass.facilityName
      });
    }
    };

    const handleAdd = () => {
      setShowAdd(true);
      if (selectedClass) {
      setFormInputs({
        className: "",
        day: "",
        startTime: "",
        endTime: "",
        price: "",
        facilityName:""
      });
    }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Update facility details with formInputs values
      setClassDetails((prevState) => {
      const updatedDetails = [...prevState];
      const index = updatedDetails.findIndex(
          (classes) => classes.classId === selectedClass.classId
      );
      updatedDetails[index].classId = formInputs.classId;
      updatedDetails[index].className = formInputs.className;
      updatedDetails[index].dayTime[0].day = formInputs.day;
      updatedDetails[index].dayTime[0].startTime = formInputs.startTime;
      updatedDetails[index].dayTime[0].endTime =  formInputs.endTime;
      updatedDetails[index].price =  formInputs.price;
      updatedDetails[index].facilityName =  formInputs.facilityName;

      return updatedDetails;
      });

      // Send updated facility details to server
      axios.put(`http://localhost:4000/api/classes/${selectedClass.classId}`, {

        className: formInputs.className,
        day: formInputs.day,
        startTime: formInputs.startTime,
        endTime: formInputs.endTime,
        price: formInputs.price,
        facilityName: formInputs.facilityName
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

      setClassDetails((prevState) => {
        const updatedDetails = [...prevState];
        
        //updatedDetails[index].staffId = formInputs.staffId;
        updatedDetails.className = formInputs.className;
        updatedDetails.day = formInputs.day;
        updatedDetails.startTime = formInputs.startTime;
        updatedDetails.endTime = formInputs.endTime;
        updatedDetails.price =  formInputs.price;
        updatedDetails.facilityName =  formInputs.facilityName;
  
        return updatedDetails;
        });

        const newClassDetails = {
          className: formInputs.className,
          price: formInputs.price,
          dayTime: [{ day: formInputs.day, startTime: formInputs.startTime, endTime: formInputs.endTime }],
          facilityName: formInputs.facilityName
        };

        setClassDetails((prevState) => {
          return [...prevState, newClassDetails];
        });

        axios.post('http://localhost:4000/api/classes/classid', newClassDetails)
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


    return(
        <div>
            <Navbar/>
            <EditClassForm 
              show={show}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              class={selectedClass}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <AddClassForm 
            showAdd={showAdd}
            handleClose={handleClose}
            handleAddSubmit={handleAddSubmit}
            formInputs={formInputs}
            setFormInputs={setFormInputs}
          />
            <div className="classDetails">
              <div className="classDetailsTable">
                    <h1 className="classDetailsTitle">Classes</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Price</th>   
                                    <th className="dayTimeColumn">Day & Time</th>
                                    <th>Facility</th>  
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {classDetails && classDetails.map(({ classId, className, price, dayTime, facilityName}, index) => (
                                <tr key = {classId}>
                                    <td>
                                      <span>{className}</span>
                                    </td>
                                    <td>
                                      <span>{price}</span>
                                    </td>
                                    <td className="dayTimeColumn">
                                      {dayTime.map(({ day, startTime, endTime }) => (
                                        <div key={`${day}-${startTime}-${endTime}`}>
                                          <span>{day}: </span>
                                          <span>{startTime} - </span>
                                          <span>{endTime}</span>
                                        </div>
                                      ))}
                                    </td>
                                    <td>
                                      <span>{facilityName}</span>
                                    </td>
                                    {isEditable && (
                                    <td>
                                    <button className="deleteButton" >
                                        Delete class
                                    </button>
                                    </td>
                                     )}
                                    <td>
                                    <button className="editButton" onClick={() => {setSelectedClass({classId, className, price, dayTime, facilityName}); handleShow(classId);}}>
                                    {editableRows[classId] ? "Done" : "Edit"}
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            {/*<div>
                            <button className="addButton" onClick={() => { handleAdd();}}>
                              Add
                            </button>
                            </div>*/}
                        </table>
                    </div>
                </div>
        </div>
    )
}

export default ClassDetails;