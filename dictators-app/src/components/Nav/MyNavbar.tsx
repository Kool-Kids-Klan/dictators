import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import NavItems from './NavItems';

export const MyNavbar = () => (
  <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
    <LinkContainer to="/">
      <Navbar.Brand className="font-weight-bold text-muted">
        Dictators
      </Navbar.Brand>
    </LinkContainer>
    <Navbar.Toggle />
    <NavItems />
  </Navbar>
);

export default MyNavbar;
