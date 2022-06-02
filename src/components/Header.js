import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../Firebase';

const HeaderContainer = styled.header`
    width: 100%;
    color: #823aa0;
`;

const Nav = styled.nav`
    width: 960px;
    margin: 0 auto;
    position: relative;
    ul {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
`;

const Logo = styled.h1`
    text-align: center;
    padding-top: 2rem;
    color: #9e54bd;
    font-weight: bold;
    font-size: 4rem;
    transform: rotate(7deg);
`;

const LocalNav = styled.nav`
    position: absolute;
    top: 10px;
    right: 0;
`;

const Button = styled.button`
    padding: 0.2rem 1rem;
    border: none;
    border-radius: 20px;
    font-size: 0.7rem;
    background: #9e54bd;
    color: #fff;
`;

function Header({user, setUser}) {

    const navigate = useNavigate();

    const handleSignOut = () => {
        console.log('sign out')
        auth.signOut();
        setUser('');
        navigate('/');
    }

    return ( 
        <HeaderContainer>
            <Nav>
                <Logo>Dooooooodles!</Logo>
            </Nav>
            <Nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/auth'>MyPage</Link></li>
                </ul>
                <LocalNav>
                    {
                        user.length > 1 &&
                        <Button onClick={handleSignOut}>Sign Out</Button>
                    }
                </LocalNav>
            </Nav>
        </HeaderContainer>
     );
}

export default Header;