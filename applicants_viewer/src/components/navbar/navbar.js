import {Container, Navbar} from "react-bootstrap";
import "../styles.css"

export default function NavBar() {
    return (
        <Navbar expand="lg" className="main_color">
            <Container>
                <Navbar.Brand href="#home" style={{color: "white"}}>Списки абитуриентов</Navbar.Brand>
            </Container>
        </Navbar>
    )
}