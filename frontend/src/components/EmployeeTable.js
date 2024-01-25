import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { Container, Form, Button, Table, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const GET_EMPLOYEES = gql`
  query {
    employeeList {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

class EmployeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      searchParams: {
        department: "",
      },
      showModal: false,
      remainingDays: 0,
      remainingMonths: 0,
      remainingYears: 0,
    };
  }

  handleChange = (e) => {
    this.setState({
      searchParams: {
        ...this.state.searchParams,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSearch = () => {
    const { data, searchParams } = this.state;

    const filteredData = data.filter((employee) => {
      let match = true;

      if (
        searchParams.department &&
        employee.department !== searchParams.department
      ) {
        match = false;
      }

      return match;
    });

    this.setState({ filteredData });
  };

  fetchData = () => {
    this.props.client
      .query({ query: GET_EMPLOYEES, fetchPolicy: "no-cache" })
      .then((result) => {
        console.log("result", result);
        const data =
          result.data && result.data.employeeList
            ? result.data.employeeList
            : [];
        this.setState({ data });
      });
  };
  handleDelete = (id,currentStatus) => {
    console.log(typeof currentStatus)
    if (currentStatus) {
      alert("CAN'T DELETE EMPLOYEE – STATUS ACTIVE");
      return;
    }

   this.props.client
    .mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id: String(id) },
    })
    .then((result) => {
      console.log("result === ", result);
      this.fetchData();
      console.log("Employee deleted:", result.data.deleteEmployee);
    })
    .catch((error) => {
      console.error("Error deleting employee:", error);
    });
  };

  formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  componentDidMount() {
    this.fetchData();
  }


  render() {
    const { filteredData } = this.state;
    const displayData =
      filteredData.length > 0 ? filteredData : this.state.data;
      const { showModal, remainingDays, remainingMonths, remainingYears } = this.state;
      const remainingMonthsDisplay = remainingMonths !== undefined ? remainingMonths.toFixed(2) : 'N/A';

      return (
        <Container className="mt-5 col-lg-11 col-12">
          <h2>Search Employees</h2>
          <div className="d-flex align-items-center gap-3 col-md-4">
            <Form.Group className="mb-3 w-100">
              <Form.Label>Department</Form.Label>
              <Form.Select
                aria-label="Default select example"
                name="department"
                onChange={this.handleChange}
              >
                <option value="">Select Department</option>
                <option value="it">IT</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
                <option value="engineering">Engineering</option>
              </Form.Select>
            </Form.Group>
            <Button
            className="search-btn"
              type="button"
              onClick={this.handleSearch}
            >
              Search
            </Button>
          </div>
          <h1 className="mb-5">Employee Table</h1>
          <div className="table-responsive">
            <Table className="text-center" bordered>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                  <th>Date of joining</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Employee Type</th>
                  <th>Current Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((res, index) => (
                  <tr style={{ color: "#666" }} key={index}>
                    <td>{index + 1}</td>
                    <td>{res.firstName}</td>
                    <td>{res.lastName}</td>
                    <td>{res.age}</td>
                    <td>
                      {res.dateOfJoining
                        ? this.formatDate(res.dateOfJoining)
                        : "Invalid Date"}
                    </td>
                    <td>{res.title}</td>
                    <td>{res.department}</td>
                    <td>{res.employeeType}</td>
                    <td>{res.currentStatus ? "Active" : "InActive"}</td>
                    <td>
                      <Link
                        to={`/edit/${res.id}`}
                        className="btn btn-success btn-sm ms-2"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => this.handleDelete(res.id,res.currentStatus)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      );
    }
  }
  
  export default EmployeeTable;
