import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

const RegisterScreen = () => {
    const [discord, setDiscord] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log('sumbit pressed')
    }
    return (
    <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group ClassName='my-2' controlId="discord">
                <Form.Label>Discord ID</Form.Label>
                <Form.Control 
                    type="text"
                    placeholder="Enter DiscordID"
                    value={discord}
                    onChange={(e)=>setDiscord(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group ClassName='my-2' controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>  
            <Form.Group ClassName='my-2' controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Confirm"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>                   
            <Button type='submit' variant="primary" className="mt-3">
                Sign Up 
            </Button>     

            <Row className="py-3">
                <Col>
                    Already registered? <Link to='/login'>Sign In</Link>
                </Col>
            </Row>
        </Form>
    </FormContainer>
  )
}

export default RegisterScreen