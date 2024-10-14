import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const AccessGiven = () => {
  const [accessData, setAccessData] = useState([]);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4OTEzMTU5LCJpYXQiOjE3Mjg5MDIzNTksImp0aSI6IjYwNDRjNTg4NDQ5YTQ4ZjZiNWM5MzA0NGNmZDU2MzU3IiwidXNlcl9pZCI6MX0.bOfBANYeolZnfmPd9lE1DUfXEaJ8Uvanr5kAgSS2Cr8";

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/employees/access_given_by_employees/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setAccessData(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных!", error);
      });
  }, [accessToken]);

  return (
    <div className="container mt-5">
      <h2>Количество разданных доступов каждым сотрудником отдела</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя Сотрудника</th>
            <th>Отдел</th>
            <th>Количество Доступов</th>
          </tr>
        </thead>
        <tbody>
          {accessData.map((data, index) => (
            <tr key={index}>
              <td>{data.employee}</td>
              <td>{data.department}</td>
              <td>{data.access_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccessGiven;
