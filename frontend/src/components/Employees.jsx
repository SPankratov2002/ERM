import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4OTEzMTU5LCJpYXQiOjE3Mjg5MDIzNTksImp0aSI6IjYwNDRjNTg4NDQ5YTQ4ZjZiNWM5MzA0NGNmZDU2MzU3IiwidXNlcl9pZCI6MX0.bOfBANYeolZnfmPd9lE1DUfXEaJ8Uvanr5kAgSS2Cr8";

  useEffect(() => {
    if (!accessToken) {
      console.error("Токен авторизации отсутствует");
      return;
    }

    axios
      .get("http://localhost:8000/api/employees/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении сотрудников!", error);
      });
  }, [accessToken]);

  return (
    <div className="container mt-5">
      <h2>Доступы Сотрудников</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя Сотрудника</th>
            <th>Отдел</th>
            <th>Доступы к Ресурсам</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>
                {employee.department ? employee.department.name : "Не указано"}
              </td>
              <td>
                {employee.accessible_resources &&
                employee.accessible_resources.length > 0 ? (
                  employee.accessible_resources.map((resource, index) => (
                    <div key={index}>{resource.name}</div> // Убедитесь, что здесь передается уникальный ключ, например `index`
                  ))
                ) : (
                  <span>Нет доступов</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Employees;
