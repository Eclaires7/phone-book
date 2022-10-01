/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, {useState, useEffect} from 'react';
import {Heading1} from '../emotion'
import {Button} from 'react-bootstrap';

let name = 'aa';
console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ name', name)

function FormContainer() {
  const [inputData, setInputData] = useState({
    first_name: '',
    last_name : '',
    phones: []
  })

  return (
    <div>
      <Heading1>Form</Heading1>
      <div>
        <div>First Name</div>
        <input type='text' placeholder='First Name...' />
      </div>
      <div>
        <div>Last Name</div>
        <input type='text' placeholder='Last Name...' />
      </div>
      <div>
        <div>Phones</div> 
        <input type='text' placeholder='First Name...' />
        <Button>+</Button>
      </div>
    </div>
  );
}

export default FormContainer;
