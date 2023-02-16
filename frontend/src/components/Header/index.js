import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './styles.css'

const Header = () => {
    return (
        // <div ref={ref}>
        <Navbar>
            <NavItem icon="Menu">
                <DropdownMenu />
            </NavItem>
            <NavItem icon="Login">
                <DropdownMenu />
            </NavItem>
        </Navbar>
        // </div>
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
    const ref = useRef();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (open && ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
    
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [open])

    return (
        <div className="nav" ref={ref}>
            <li className="nav-item">
                <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                    {props.icon}
                </a>
                {open && props.children}
            </li>   
        </div>
    );
}

function DropdownMenu() {

    const [activeMenu, setActiveMenu] = useState('main'); // settings, anmials
    const [menuHeight, setMenuHeight] = useState(null);

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }


    function DropdownItem(props) {
        return (
            <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span className='icon-left'>{props.leftIcon}</span>
                {props.children}
                <span className='icon-right'>{props.rightIcon}</span>
            </a>
        )
    }
    return (
        <div className='dropdown' style={{ height: menuHeight }}>
            <CSSTransition in={activeMenu === "main"} unmountOnExit timeout={500} classNames="menu-primary" onEnter={calcHeight}>
                <div className='menu'>
                    <DropdownItem>My Profile</DropdownItem>
                    <DropdownItem leftIcon="left" rightIcon="right" goToMenu="settings">Settings</DropdownItem>
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "settings"} unmountOnExit timeout={500} classNames="menu-secondary" onEnter={calcHeight}>
                <div className='menu'>
                    <DropdownItem leftIcon="<-" goToMenu="main"></DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                </div>
            </CSSTransition>
        </div>
    );
}

export default Header