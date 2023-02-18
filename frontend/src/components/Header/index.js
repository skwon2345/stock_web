import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './styles.css'

const Header = () => {
    function MenuItem(id=0, left="", content="", right={}) {
        this.id = id;
        this.left = left;
        this.content = content;
        this.right = right;
    }

    const menu_list = [
        new MenuItem(0, "", "My Profile", {}),
        new MenuItem(1, "", "My Profile2", {enter:">", exit:"X", content:[
            new MenuItem(0, "", "My Profile3", {})
        ]}),
    ];
    const login_list = [
        new MenuItem(0, "", "My Profil1e", {})
    ];

    return (
        // <div ref={ref}>
        <Navbar>
            <NavItem icon="Menu">
                <DropdownMenu item={menu_list}/>
            </NavItem>
            <NavItem icon="Login">
                <DropdownMenu item={login_list}/>
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

function DropdownMenu(props) {

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

    function RenderMe(props) {
        return (
            <>
                
            </>
        )

    }

    return (
        <div className='dropdown' style={{ height: menuHeight }}>
            {            
                props.item.map(({id, left, content, right}) => {
                    let menuItem;
                    let nestedMenuItem;
                    if (Object.keys(right).length) {
                        menuItem = <DropdownItem key={id} leftIcon={left} content={content} rightIcon={right.enter} goToMenu={content}>{content}</DropdownItem>;
                        nestedMenuItem = (
                                <CSSTransition in={activeMenu === {content}} unmountOnExit timeout={500} classNames="menu-secondary" onEnter={calcHeight}>
                                    <div className='menu'>
                                        <DropdownItem key={id} leftIcon={right.exit} goToMenu="main"></DropdownItem>
                                    </div>
                                </CSSTransition>
                            )
                        console.log(activeMenu)

                    } else {
                        menuItem = <DropdownItem key={id} leftIcon={left}>{content}</DropdownItem>
                    }
                    console.log(activeMenu)

                    return (
                        <div key={id}>
                            <CSSTransition key={id} in={(activeMenu === "main")} unmountOnExit timeout={500} classNames="menu-primary" onEnter={calcHeight}>
                                <div className='menu'>
                                    {menuItem}
                                </div>
                            </CSSTransition>
                            { nestedMenuItem && console.log(nestedMenuItem.props) }
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Header