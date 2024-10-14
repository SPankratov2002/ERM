import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const EmployeesThreeAccesses = () => {
  const [employees, setEmployees] = useState([]);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4OTEzMTU5LCJpYXQiOjE3Mjg5MDIzNTksImp0aSI6IjYwNDRjNTg4NDQ5YTQ4ZjZiNWM5MzA0NGNmZDU2MzU3IiwidXNlcl9pZCI6MX0.bOfBANYeolZnfmPd9lE1DUfXEaJ8Uvanr5kAgSS2Cr8";

  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/api/employees/employees_with_more_than_three_accesses/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных!", error);
      });
  }, [accessToken]);

  return (
    <div className="container mt-5">
      <h2>Сотрудники с более чем 3 доступами к ресурсам</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя Сотрудника</th>
            <th>Отдел</th>
            <th>Количество Доступов</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employee}</td>
              <td>{employee.department}</td>
              <td>{employee.access_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeesThreeAccesses;
