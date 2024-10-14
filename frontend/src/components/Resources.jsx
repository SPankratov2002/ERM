import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4OTEzMTU5LCJpYXQiOjE3Mjg5MDIzNTksImp0aSI6IjYwNDRjNTg4NDQ5YTQ4ZjZiNWM5MzA0NGNmZDU2MzU3IiwidXNlcl9pZCI6MX0.bOfBANYeolZnfmPd9lE1DUfXEaJ8Uvanr5kAgSS2Cr8";

  useEffect(() => {
    if (!accessToken) {
      console.error("Токен авторизации отсутствует");
      return;
    }

    axios
      .get("http://localhost:8000/api/resources/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setResources(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении ресурсов!", error);
      });
  }, [accessToken]);

  return (
    <div className="container mt-5">
      <h2>Доступы к Ресурсам</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя Ресурса</th>
            <th>Владелец (Отдел)</th>
            <th>Сотрудники с Доступом</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td>{resource.name}</td>
              <td>
                {resource.owner && resource.owner.department
                  ? resource.owner.department.name
                  : "Не указано"}
              </td>
              <td>
                {resource.access_granted_to &&
                resource.access_granted_to.length > 0 ? (
                  resource.access_granted_to.map((employee) => (
                    <div key={employee.id}>{employee.name}</div>
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

export default Resources;
