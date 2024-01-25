// EmployeeEdit.js
import React, { useState, useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { Container, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployee($id: ID!) {
    employeeById(id: $id) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      currentStatus
      employeeType
    }
  }
`;

const EmployeeEdit = () => {
    const client = useApolloClient();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        dateOfJoining: "",
        title: "",
        department: "",
        employeeType: "",
        currentStatus: ""
    });

    useEffect(() => {
        if (id) {
            client
                .query({
                    query: GET_EMPLOYEE_BY_ID,
                    variables: { id },
                })
                .then((result) => {
                    const { data } = result;
                    if (data && data.employeeById) {
                        setFormData({
                            firstName: data.employeeById.firstName,
                            lastName: data.employeeById.lastName,
                            age: data.employeeById.age,
                            dateOfJoining: data.employeeById.dateOfJoining,
                            title: data.employeeById.title,
                            department: data.employeeById.department,
                            employeeType: data.employeeById.employeeType,
                            currentStatus: data.employeeById.currentStatus,
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [client, id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        console.log("values", e.target.value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            const editEmp = gql`
        mutation UpdateEmployee(
          $id: ID!
          $updatedEmployee: EmployeeInputs!
        ) {
          employeeEdit(id: $id, updatedEmployee: $updatedEmployee)
        }
      `;
            await client.mutate({
                mutation: editEmp,
                variables: {
                    id: id,
                    updatedEmployee: formData,
                },
            });

            alert("Employee updated successfully!");
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-5 mx-auto">Employee Edit Form</h1>
            <Form
                className="shadow mx-auto p-md-5 p-3 mb-5 bg-body-tertiary col-xl-7 col-lg-8 col-md-11 col-12"
                onSubmit={handleSubmit}
            >
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={id}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={id}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        disabled={id}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date Of Joining</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="Enter date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                        disabled={id}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Select
                        aria-label="Select Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    >
                        <option value="">Select Title</option>
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="director">Director</option>
                        <option value="vp">VP</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                        aria-label="Select Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                    >
                        <option value="">Select Department</option>
                        <option value="it">IT</option>
                        <option value="marketing">Marketing</option>
                        <option value="hr">HR</option>
                        <option value="engineering">Engineering</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>EmployeeType</Form.Label>
                    <Form.Select
                        aria-label="Select EmployeeType"
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleChange}
                    >
                        <option value="">Select EmployeeType</option>
                        <option value="fullTime">FullTime</option>
                        <option value="partTime">PartTime</option>
                        <option value="contract">Contract</option>
                        <option value="seasonal">Seasonal</option>
                    </Form.Select>
                </Form.Group>
                {/* <Form.Group className="mb-3">
          <Form.Label>Current Status</Form.Label>
          <Form.Select
            aria-label="Current Status"
            name="currentStatus"
            value={formData.currentStatus}
            onChange={handleChange}
          >
            <option value="">Current Status</option>
            <option value="active">Active</option>
            <option value="retired">Retired</option>
          </Form.Select>
        </Form.Group> */}
                <Form.Group className="mb-3">
                    <Form.Check
                        type="switch"
                        id="currentStatusSwitch"
                        label={`Current Status: ${formData.currentStatus ? 'Active' : 'Retired'}`}
                        checked={formData.currentStatus}
                        onChange={(e) => handleChange({ target: { name: 'currentStatus', value: e.target.checked } })}
                    />
                </Form.Group>
                <Button type="submit" variant="success">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default EmployeeEdit;
