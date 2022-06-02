import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import Card from '../components/Card';
import { database, storage } from '../Firebase';

const Container = styled.div`
    width: 960px;
    margin: 0 auto;
`;

const Wrapper = styled.div`
    width: 100%;
`;

const Info = styled.div`
    text-align: center;
    font-size: 0.8rem;
    color: #bbb;
    margin-bottom: 2rem;
`;

const Form = styled.form`
    width: 80%;
    margin: 40px auto;
    display: flex;
    justify-content: center;
`;

const Input = styled.input`
    padding: 0.4rem;
    width: 50%;
    margin-right: 4px;
    border: 1.5px solid #03384b;
    &::placeholder {
        color: #9e54bd;
        opacity: 0.5;
    }
`;

const Upload = styled.label`
    display: inline-block;
    padding: 0.4rem;
    font-size: 0.8rem;
    background: #9e54bd;
    color: #fff;
    margin-right: 4px;
    vertical-align: middle;
    cursor: pointer;
`;

const InputFile = styled(Input)`
    width: 0;
    height: 0;
    padding: 0;
    border: 0;
`;

const ThumbneilContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
`;

const Thumbneil = styled.div`
    max-width: 120px;
    img {
        width: 100%;
        height: auto;
    }
`;

const Button = styled.button`
    padding: 0.7rem 2rem;
    margin: ${props => props.margin || '0'};
    border: none;
    border-radius: 20px;
    background: #9e54bd;
    color: #fff;
    position: relative;
    &:hover {
        background: #823aa0;
    }
`;


function Main({user}) {

    const date = new Date();

    const [message, setMessage] = useState('');
    const [list, setList] = useState([]);
    const [file, setFile] = useState(null);

    const onChange = (e) => {
        const { target: {value} } = e;
        setMessage(value);
    }

    const readFile = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            // console.log(reader.result);
            setFile(reader.result);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        let url = '';
        try {
            // text content가 없는 경우
            if(message === '') return;
            // image file 첨부된 경우
            if(file !== null) {
                const fileRef = ref(storage, `${user}/${v4()}`);
                const response = await uploadString(fileRef, file, 'data_url');
                url = await getDownloadURL(response.ref);
            }
            // add firestore and storage
            await addDoc(collection(database, 'doodle'), {
                content : message,
                created : `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
                writer : user,
                url
            });
        } catch(err) {
            console.error(err);
        }
        setMessage('');
        setFile(null);
    }
    
    const getList = () => {
        onSnapshot(collection(database, 'doodle'), (snapshot) => {
            const messageArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setList(messageArr);
        })
    }

    useEffect(() => {
        getList();
    }, []);

    return ( 
        <Container>
            <Wrapper>
                {
                    user.length > 1
                    ? <Form onSubmit={onSubmit}>
                        <Input type='text' name='message' placeholder="What's happening? (140자 이내)" value={message} maxLength={140} onChange={onChange} />
                        <Upload>
                            + File
                            <InputFile type='file' accept='image/*' onChange={readFile} />
                        </Upload>
                        <Button>Submit</Button>
                    </Form>
                    : <Info>
                        My Page에서 회원가입 후 글을 작성하실 수 있습니다.
                    </Info>
                }
                {
                    file &&
                    <ThumbneilContainer>
                        <Thumbneil>
                            <img src={file} alt='file image' />
                        </Thumbneil>
                    </ThumbneilContainer>
                }
            </Wrapper>
            <Wrapper>
                {
                    list &&
                    list.map(content => (
                        <Card key={content.id} user={user} content={content} />
                    ))
                }
            </Wrapper>
        </Container>
     );
}

export default Main;