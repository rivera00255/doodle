import { auth, database } from '../Firebase';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Container = styled.div`
    width: 960px;
    margin: 0 auto;
    color: #823aa0;
`;

const Wrapper = styled.div`
    width: 100%;
`;

const Title = styled.h2`
    text-align: center;
    margin: 2rem 0;
    font-size: 2rem;
`;

const Form = styled.form`
    width: 40%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`;

const List = styled.div`
    width: 100%;
`;

const Input = styled.input`
    padding: 0.5rem 0.4rem;
    margin-bottom: 0.5rem;
    border: 1.5px solid #03384b;
    &::placeholder {
        color: #9e54bd;
        opacity: 0.5;
    }
`;

const ButtonWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem;
`;

const Button = styled.button`
    padding: 0.7rem 2rem;
    border: none;
    border-radius: 20px;
    background: #9e54bd;
    color: #fff;
    position: relative;
    &::before {
        position: absolute;
        top: -4px;
        right: -3px;
        content: '';
        width: 95%;
        height: 85%;
        border: 2px solid #03384b;
        border-radius: 20px;
    }
    &:hover {
        background: #823aa0;
    }
    &:hover&::before {
        top: -3px;
        right: -1px;
    }
`;

const InfoWrap = styled(ButtonWrap)`
    margin: 1rem 0;
    font-size: 0.8rem;
`;

function Auth({user, setUser}) {

    const [register, setRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const onChange = (e) => {
        const { target: {name, value}  } = e;
        name === 'email' && setEmail(value);
        name === 'password' && setPassword(value);
    }

    const deleteId = () => {
        deleteUser(auth.currentUser);
        setUser('');
        navigate('/');
    }

    const getContent = async () => {
        const q = query(
            collection(database, "doodle"), 
            where("writer", "==", user)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
        })
    }

    useEffect(() => {
        // getContent();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        let data;
        try {
            if(register) {
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                data = await signInWithEmailAndPassword(auth, email, password);
                navigate('/')
            }
            // console.log(data);
        } catch(err) {
            // console.log(err);
            setErrorMsg(err.message);
        }
    }

    return ( 
        <Container>
            <Wrapper>
                {
                    user.length > 1
                    ? (
                        <>
                            <Title>
                                Hello! {user}
                            </Title>
                            <ButtonWrap>
                                <Button onClick={deleteId}>Delete ID</Button>
                            </ButtonWrap>
                        </>
                    )
                    : (
                        <>
                            <Title>{register ? 'Sing Up' : 'Sign In'}</Title>
                            <Form onSubmit={onSubmit}>
                                <Input type='text' placeholder='Email' name='email' value={email} onChange={onChange} />
                                <Input type='password' placeholder='Password' name='password' value={password} onChange={onChange} />
                                <ButtonWrap>
                                    <Button>{register ? 'Sing Up' : 'Sign In'}</Button>
                                </ButtonWrap>
                            </Form>
                            {
                                errorMsg &&
                                <InfoWrap>{errorMsg}</InfoWrap>
                            }
                            {
                                register
                                ? null
                                : <ButtonWrap>
                                    <Button onClick={() => setRegister(true)}>Sign Up</Button>
                                </ButtonWrap>
                            }
                        </>
                    )
                }
            </Wrapper>
        </Container>
     );
}

export default Auth;