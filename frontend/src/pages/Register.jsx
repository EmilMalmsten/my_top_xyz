import { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailureAlert, setShowFailureAlert] = useState(false);
    const [failureAlertMessage, setFailureAlertMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (showSuccessAlert) {
            const timeout = setTimeout(() => {
                navigate("/login");
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [showSuccessAlert, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity()) {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
                    email,
                    password,
                });
                setShowFailureAlert(false);
                setShowSuccessAlert(true);
            } catch (error) {
                console.error(error);
                if (error.response && error.response.data) {
                    setShowFailureAlert(true);
                    setFailureAlertMessage(error.response.data.error);
                } else {
                    setShowFailureAlert(true);
                    setFailureAlertMessage(
                        "Registration failed. Please try again."
                    );
                }
            }
        }
        form.classList.add("was-validated");
    };

    const handleInputChange = (event, setState) => {
        setState(event.target.value);
    };

    return (
        <Container style={{ maxWidth: "50%", margin: "3rem auto" }}>
            <div style={{ margin: "0 auto" }}>
                {showSuccessAlert && (
                    <Alert
                        variant="success"
                        onClose={() => setShowSuccessAlert(false)}
                        dismissible
                    >
                        Registration successful! Redirecting to login page...
                    </Alert>
                )}
                {showFailureAlert && (
                    <Alert
                        variant="danger"
                        onClose={() => setShowFailureAlert(false)}
                        dismissible
                    >
                        {failureAlertMessage}
                    </Alert>
                )}
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group
                        controlId="email"
                        style={{ marginBottom: "1rem" }}
                    >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => handleInputChange(e, setEmail)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                        controlId="password"
                        style={{ marginBottom: "1rem" }}
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Enter password"
                            minLength="8"
                            value={password}
                            onChange={(e) => handleInputChange(e, setPassword)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Password must be at least 8 characters.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                        controlId="repeatPassword"
                        style={{ marginBottom: "1rem" }}
                    >
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Repeat password"
                            minLength="8"
                            value={repeatPassword}
                            onChange={(e) =>
                                handleInputChange(e, setRepeatPassword)
                            }
                            pattern={`^${password}$`}
                        />
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default Register;
