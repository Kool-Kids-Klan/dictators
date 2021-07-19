import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import NavItems from './NavItems';

export const Navbar = () => (
  <nav className="Navbar">
    <ul className="navigation">
      <NavItems />
    </ul>
  </nav>
);

export default Navbar;
