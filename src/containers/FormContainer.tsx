import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

let name = 'aa';
console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ name', name)

function FormContainer() {
  return (
    <div css={css`
    background-color: black;
  `}>
      Hahahaaa
    </div>
  );
}

export default FormContainer;
