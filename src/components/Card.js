import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React from 'react';
import styled from 'styled-components';
import { database, storage } from '../Firebase';

const CardContainer = styled.div`
    width: 60%;
    height: 320px;
    margin: 0 auto;
    border: 2px solid #03384b;
    border-radius: 40px;
    margin-bottom: 10px;
    box-sizing: border-box;
    padding: 2rem;
    position: relative;
    p {
        margin: 10px 0;
        font-size: 0.8rem;
        color: #444;
    }
    strong {
        font-size: 1rem;
    }
`;

const Attachment = styled.div`
    width: 100px;
    img {
        width: 100%;
        height: auto;
    }
`;

const ButtonWrap = styled.div`
    position: absolute;
    bottom: 2rem;
    width: 90%;
    display: flex;
    justify-content: right;
`;

const Button = styled.button`
    padding: 0.5rem 1.4rem;
    margin: ${props => props.margin || '0'};
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

function Card({content, user}) {

    const onDelete = async (id, url) => {
        // console.log(content);
        await deleteDoc(doc(database, 'doodle', id));
        deleteObject(ref(storage, url));
    }

    return ( 
        <CardContainer key={content.id}>
            <p><strong>{content.content}</strong></p>
            {
                content.url &&
                <Attachment>
                    <img src={content.url} alt='image' />
                </Attachment>
            }
            <p>{content.created}</p>
            {
                (user && user === content.writer) &&
                <ButtonWrap>
                {/* <Button margin={'0 10px'}>edit</Button> */}
                <Button onClick={() => onDelete(content.id, content.url)}>delete</Button>
            </ButtonWrap>
            }
        </CardContainer>
     );
}

export default Card;