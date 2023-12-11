import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import "./PerfilStyle.css";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleChangeName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Error: El campo de nombre no puede estar vacío");
      return;
    }

    try {
      setLoading(true);

      if (userId && userId.trim() !== "") {
        const response = await axios.put(
          `https://bakend-tu-apple-online.vercel.app/api/profile/update-name/${userId}`,
          { newName: name },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (response.status === 200) {
          setMessage(data.message);
          setName(data.usuario.nombre);
          sessionStorage.setItem("nombre", data.usuario.nombre);
        } else {
          setMessage(data.error);
        }
      } else {
        setMessage("Error: userId no definido o es una cadena vacía");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al cambiar el nombre");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Error: El campo de correo electrónico no puede estar vacío");
      return;
    }

    try {
      setLoading(true);

      if (userId) {
        const response = await axios.put(
          `https://bakend-tu-apple-online.vercel.app/api/profile/update-email/${userId}`,
          { newEmail: email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (response.status === 200) {
          setMessage(data.message);
          setEmail(data.usuario.email);
        } else {
          setMessage(data.error);
        }
      } else {
        setMessage("Error: userId no definido");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al cambiar el correo electrónico");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim()) {
      setMessage("Error: Los campos de contraseña no pueden estar vacíos");
      return;
    }

    try {
      setLoading(true);

      if (userId) {
        const response = await axios.put(
          `https://bakend-tu-apple-online.vercel.app/api/profile/update-password/${userId}`,
          {
            currentPassword: currentPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (response.status === 200) {
          setMessage(data.message);
          setCurrentPassword("");
          setNewPassword("");
        } else {
          setMessage(data.error);
        }
      } else {
        setMessage("Error: userId no definido");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="py-5 main-content">
      <Row className="justify-content-center">
        <Col className=" align-items-center d-flex">
          <Form className="btn-form">
            <h2 className="form-title">Cambiar Nombre</h2>
            <Form.Group className="mb-3 input-container">
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="button-submit"
              onClick={handleChangeName}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Cambiar Nombre"}
            </Button>
          </Form>
        </Col>
        <Col className=" align-items-center d-flex">
          <Form className="btn-form">
            <h2 className="form-title">Cambiar Correo Electrónico</h2>
            <Form.Group className="mb-3 input-container">
              <Form.Control
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="button-submit"
              onClick={handleChangeEmail}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Cambiar Correo Electrónico"}
            </Button>
          </Form>
        </Col>
        <Col className=" align-items-center d-flex">
          <Form className="btn-form">
            <h2 className="form-title">Cambiar Contraseña</h2>
            <Form.Group className="mb-3 input-container">
              <Form.Control
                type="password"
                placeholder="Contraseña Actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 input-container">
              <Form.Control
                type="password"
                placeholder="Nueva Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="button-submit"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Cambiar Contraseña"}
            </Button>
          </Form>
        </Col>
      </Row>
      {message && (
        <Row>
          <Col className="d-flex align-items-center d-flex col">
            <Alert variant="dark" className="mt-4 text-bg-dark text-center">
              {message}
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Profile;
