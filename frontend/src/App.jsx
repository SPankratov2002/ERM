import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Navbar, Nav, Container, Card } from "react-bootstrap";
import Employees from "./components/Employees";
import Resources from "./components/Resources";
import AccessGiven from "./components/AccessGiven";
import AccessGivenDepartments from "./components/AccessGivenDepartments";
import EmployeesThreeAccesses from "./components/EmployeesThreeAccesses";

const App = () => {
  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/">УРС</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/employees-access">
                Сотрудники
              </Nav.Link>
              <Nav.Link as={Link} to="/resources-access">
                Ресурсы
              </Nav.Link>
              <Nav.Link as={Link} to="/access_given_by_employees">
                Разданные Доступы
              </Nav.Link>
              <Nav.Link as={Link} to="/access_given_to_other_departments">
                Доступы к отделам
              </Nav.Link>
              <Nav.Link as={Link} to="/employees_with_more_than_three_accesses">
                Сотрудники с множестов доступов
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center mt-5">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Text>Выберите раздел для просмотра</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            }
          />
          <Route path="/employees-access" element={<Employees />} />
          <Route path="/resources-access" element={<Resources />} />
          <Route path="/access_given_by_employees" element={<AccessGiven />} />
          <Route
            path="/access_given_to_other_departments"
            element={<AccessGivenDepartments />}
          />
          <Route
            path="/employees_with_more_than_three_accesses"
            element={<EmployeesThreeAccesses />}
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
