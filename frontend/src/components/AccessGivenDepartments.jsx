import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const AccessGivenDepartments = () => {
  const [accessData, setAccessData] = useState([]);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4OTEzMTU5LCJpYXQiOjE3Mjg5MDIzNTksImp0aSI6IjYwNDRjNTg4NDQ5YTQ4ZjZiNWM5MzA0NGNmZDU2MzU3IiwidXNlcl9pZCI6MX0.bOfBANYeolZnfmPd9lE1DUfXEaJ8Uvanr5kAgSS2Cr8";

  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/api/employees/access_given_to_other_departments/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setAccessData(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных!", error);
      });
  }, [accessToken]);

  return (
    <div className="container mt-5">
      <h2>Доступы на другие отделы</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя Ресурса</th>
            <th>Отдел Владелец</th>
            <th>Отдел Получатель Доступа</th>
          </tr>
        </thead>
        <tbody>
          {accessData.map((data, index) => (
            <tr key={index}>
              <td>{data.resource}</td>
              <td>{data.owner_department}</td>
              <td>{data.granted_to_department}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccessGivenDepartments;
