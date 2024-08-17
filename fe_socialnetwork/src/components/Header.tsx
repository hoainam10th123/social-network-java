"use client"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { signIn, useSession, signOut } from "next-auth/react";
import Badge from 'react-bootstrap/Badge';
import Link from 'next/link';


export default function Header() {
    const { data: session } = useSession()

    const login = async () => {
        await signIn()
    }

    return (
        <Navbar bg="primary">
            <Container>
                <Navbar.Brand href="/">Social-Network</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Nav>
                        <Link href="/">Home</Link>
                        <Link href="/errors">Errors</Link>
                        {
                            !session && (
                                <Button variant="primary" type="button" onClick={login}>
                                    Login
                                </Button>
                            )
                        }
                    </Nav>
                    {
                        session && (
                            <Nav style={{ alignItems: 'center' }}>
                                <Badge bg="success">{session.user.user.username}</Badge>
                                {/* <div style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>{session.user.user.username}</div> */}
                                <Button variant="primary" type="button" onClick={async () => await signOut()}>
                                    Logout
                                </Button>
                            </Nav>
                        )
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}