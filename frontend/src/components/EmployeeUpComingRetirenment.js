import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Container, Table, Form } from "react-bootstrap";
import { ApolloConsumer } from "@apollo/client";

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

class EmployeeUpcomingRetirement extends Component {
  constructor() {
    super();
    this.state = {
      name: "Upcoming Retirement",
      employeeTypeFilter: "all",
      employees: [],
      filteredEmployees: [],
      searchQuery: "",
      ageOfRetirement: 65,
    };
  }

  async componentDidMount() {
    const data = await this.getEmployees();
    const employeesFilter = this.filterUpcomingRetirement(data);
    this.setState({ employees: employeesFilter, filteredEmployees: employeesFilter });
  }

  getEmployees = async () => {
    const { employeeTypeFilter } = this.state;

    try {
      const response = await this.props.client.query({
        query: GET_EMPLOYEES,
        variables: {
          employeeType: employeeTypeFilter === "all" ? null : employeeTypeFilter,
        },
        fetchPolicy: "no-cache",
      });

      const employees = response.data.employeeList || [];

      console.log("employees===", employees)

      this.setState({
        employees,
        loading: response.loading,
        error: null,
      });

      return employees;
    } catch (error) {
      console.error("Error: ", error);
      this.setState({
        loading: false,
        error: error,
      });
      return [];
    }
  };

  filterUpcomingRetirement = (employees) => {
    const { ageOfRetirement } = this.state;
    
    const employeesFilter = employees.filter((employee) => {
      const dateOfJoining = new Date(employee.dateOfJoining);
  
      try {
        if (!isNaN(dateOfJoining.getTime())) {
          const retirementAgeDate = new Date(dateOfJoining);
          retirementAgeDate.setFullYear(retirementAgeDate.getFullYear() + ageOfRetirement);
  
          const retirementDate = new Date(retirementAgeDate);
          retirementDate.setMonth(retirementDate.getMonth() - 6);
  
          const currentDate = new Date();
  
          if (
            !isNaN(retirementDate.getTime()) &&
            !isNaN(currentDate.getTime()) &&
            retirementDate <= currentDate
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          console.error("Invalid dateOfJoining:", employee.dateOfJoining);
          return false;
        }
      } catch (error) {
        console.error("Error during date conversion:", error);
        return false;
      }
    });
    
    return employeesFilter;
  };

  handleSearchChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const employeeTypeFilter = event.target.value; 
  
    const filteredEmployees = this.state.employees.filter((employee) =>
      employee.employeeType.toLowerCase().includes(searchQuery)
    );
  
    this.setState({ filteredEmployees, searchQuery, employeeTypeFilter });
  };

  renderTable() {
    const { filteredEmployees } = this.state;

    if (filteredEmployees.length === 0) {
      return <p>No employees found.</p>;
    }

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Title</th>
            <th>Department</th>
            <th>Employee Type</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.age}</td>
              <td>{employee.dateOfJoining}</td>
              <td>{employee.title}</td>
              <td>{employee.department}</td>
              <td>{employee.employeeType}</td>
              <td>
                {employee.currentStatus ? "Working" : "Retired"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <Container className="mt-5">
        <h1>{this.state.name}</h1>
        <Form.Group controlId="employeeTypeFilter" className="mb-3">
          <Form.Label>Search by Employee Type:</Form.Label>
          <Form.Select
            value={this.state.searchQuery}
            onChange={this.handleSearchChange}
          >
            <option value="all">All</option>
            <option value="fullTime">FullTime</option>
              <option value="partTime">PartTime</option>
              <option value="contract">Contract</option>
              <option value="seasonal">Seasonal</option>
          </Form.Select>
        </Form.Group>
        {this.renderTable()}
      </Container>
    );
  }
}

const EmployeeUpcomingRetirementComponent = (props) => (
  <ApolloConsumer>
    {(client) => <EmployeeUpcomingRetirement {...props} client={client} />}
  </ApolloConsumer>
);

export default EmployeeUpcomingRetirementComponent;
