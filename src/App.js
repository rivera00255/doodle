import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import { auth } from './Firebase';
import Auth from './pages/Auth';
import Main from './pages/Main';

const GlobalStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    a {
        text-decoration: none;
        color: #823aa0;
    }
`;

function App() {

  const [user, setUser] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged(loggedInUser => {
      if(loggedInUser) {
        setUser(loggedInUser.email);
      }
    })
  }, []);

  return (
      <>
          <GlobalStyle />
          <BrowserRouter>
              <Header user={user} setUser={setUser} />
              <Routes>
                  <Route path='/' element={<Main user={user} />} />
                  <Route path='/auth' element={<Auth user={user} setUser={setUser} />} />
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
