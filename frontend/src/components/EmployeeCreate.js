import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { Outlet } from "react-router-dom";


class EmployeeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: "",
        lastName: "",
        age: "",
        dateOfJoining: "",
        title: "",
        department: "",
        employeeType: "",
      },
      errors: {},
    };
  }
  clientx = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "http://localhost:3000/graphql",
    }),
  });

  validateForm = () => {
    const { formData } = this.state;
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 20 || formData.age > 70) {
      newErrors.age = "Age must be between 20 and 70";
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of joining is required";
    }

    if (!formData.title) {
      newErrors.title = "Title is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.employeeType) {
      newErrors.employeeType = "Employee type is required";
    }

    this.setState({ errors: newErrors });

    return Object.keys(newErrors).length === 0;
  };

  

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.validateForm()) {
      try {
        const {
          firstName,
          lastName,
          age,
          dateOfJoining,
          title,
          department,
          employeeType,
        } = this.state.formData;

        const addEmp = gql`
              mutation Mutation {
                employeeAdd(employee:
                {
                  firstName:"${firstName}",
                  lastName:"${lastName}",
                  age:${Number(age)},
                  title:"${title}",
                  department:"${department}",
                  employeeType:"${employeeType}"
                  dateOfJoining:"${dateOfJoining}",
                }) {
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
        await this.clientx.mutate({
          mutation: addEmp,
        });

        alert("Employee created successfully!");

        this.setState({
          formData: {
            firstName: "",
            lastName: "",
            age: "",
            dateOfJoining: "",
            title: "",
            department: "",
            employeeType: "",
          },
        });
      } catch (error) {
        console.log("Error creating employee:", error);
        alert("Error creating employee. Please try again.");
      }
    }
  };

  handleChange = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    const { formData, errors } = this.state;

    return (
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-5">Employee Create Form</h1>
        <form
          className="shadow p-md-5 p-3 mb-5 bg-body-tertiary col-xl-7 col-lg-8 col-md-11 col-12"
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <div className="d-flex flex-md-row flex-column justify-content-between gap-md-3 gap-0">
            <div className="mb-3 w-100">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter First Name"
                name="firstName"
                value={formData.firstName}
                onChange={this.handleChange}
              />
              {errors.firstName && (
                <span className="text-danger">{errors.firstName}</span>
              )}
            </div>

            <div className="mb-3 w-100">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={this.handleChange}
              />
              {errors.lastName && (
                <span className="text-danger">{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="d-flex flex-md-row flex-column justify-content-between gap-md-3 gap-0">
            <div className="mb-3 w-100">
              <label className="form-label">Age:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Age"
                name="age"
                value={formData.age}
                onChange={this.handleChange}
              />
              {errors.age && <span className="text-danger">{errors.age}</span>}
            </div>

            <div className="mb-3 w-100">
              <label className="form-label">Date Of Joining</label>
              <input
                type="date"
                className="form-control"
                placeholder="Enter date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={this.handleChange}
              />
              {errors.dateOfJoining && (
                <span className="text-danger">{errors.dateOfJoining}</span>
              )}
            </div>
          </div>

          <div className="d-flex flex-md-row flex-column justify-content-between gap-md-3 gap-0">
            <div className="mb-3 w-100">
              <label className="form-label">Title</label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="title"
                value={formData.title}
                onChange={this.handleChange}
              >
                <option value="">Select Title</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="vp">VP</option>
              </select>
              {errors.title && (
                <span className="text-danger">{errors.title}</span>
              )}
            </div>

            <div className="mb-3 w-100">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="department"
                value={formData.department}
                onChange={this.handleChange}
              >
                <option value="">Select Department</option>
                <option value="it">IT</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
                <option value="engineering">Engineering</option>
              </select>
              {errors.department && (
                <span className="text-danger">{errors.department}</span>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">EmployeeType</label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="employeeType"
              value={formData.employeeType}
              onChange={this.handleChange}
            >
              <option value="">Select EmployeeType</option>
              <option value="fullTime">FullTime</option>
              <option value="partTime">PartTime</option>
              <option value="contract">Contract</option>
              <option value="seasonal">Seasonal</option>
            </select>
            {errors.employeeType && (
              <span className="text-danger">{errors.employeeType}</span>
            )}
          </div>

          <div className="mb-3">
            <button type="submit" className="btn search-btn">
              Submit
            </button>
          </div>
        </form>
        <Outlet />
      </div>
    );
  }
}

export default EmployeeCreate;
