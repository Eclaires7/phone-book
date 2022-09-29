import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import './App.css';

let name = 'aa';
console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ name', name)

function App() {
  return (
    <div css={css`
    background-color: hotpink;
  `}>
      Hahahaaa
    </div>
  );
}

export default App;
