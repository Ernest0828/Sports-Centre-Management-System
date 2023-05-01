import { Form, Button } from "react-bootstrap"
import axios from 'axios'
import {useContext, useState} from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

const EditDiscountForm = ({showDiscount, handleClose, handleSubmitDiscount, discountInputs, setDiscountInputs}) => {
  
    const handleFormInputChange = (event) => {
        setDiscountInputs({
          ...discountInputs,
          [event.target.name]: event.target.value
        });
      };
      
      return (
        <Modal show={showDiscount} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Edit discount</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitDiscount}>
      
            <Form.Group controlId="formDiscount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="discount"
                value={discountInputs.discount}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>
      
            <Button style={{marginTop: "10px"}}variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default EditDiscountForm;