import React, { useState, useEffect, useRef } from 'react';
import './styles.css'

const Header = () => {
    return (
        <Navbar>
            <NavItem icon="a" />
            <NavItem icon="b" />
            <NavItem icon="c" />
            <NavItem icon="d">
                <DropdownMenu />
            </NavItem>
        </Navbar>
    )
}

function Navbar(props) {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">{props.children}</ul>
        </nav>
    );
}

function NavItem(props) {
    const [open, setOpen] = useState(false);

    return (
        <li className="nav-item">
            <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>
            
            {open && props.children}
        </li>
    );
}

function DropdownMenu() {
    return (
        <div className='dropdown'>

        </div>
    );
}

export default Header