/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, {useState, useEffect} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Heading1} from '../emotion'
import {Button} from 'react-bootstrap';

let name = 'aa';
console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ name', name)

function FormContainer() {
  const [inputData, setInputData] = useState({
    first_name: '',
    last_name : '',
    phones: [{number: ''}]
  })
  console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ inputData', inputData)

  function submitNew() {
    let error = ''
    const firstName = (document.getElementById('addFirstName') as HTMLInputElement).value
    const lastName = (document.getElementById('addLastName') as HTMLInputElement).value

    const regex = /^[A-Za-z0-9 ]+$/
    if (!regex.test(firstName)) {
      error = 'First name must not have special character'
    } else if (!regex.test(lastName)) {
      error = 'Last name must not have special character'
    } // cari tau cara harus unique, mungkin get data dulu cek ada yg namanya first AND last, baru submit

    let data = inputData
    data.first_name = firstName
    data.last_name = lastName

    if (error !== '') {
      NotificationManager.error(error, 'Error input', 3000);
    } else {
      console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ data', data)
    }
    
  }

  function handlePhones(e: any, phoneIndex: number) {
    let data = {...inputData}
    data.phones[phoneIndex].number = e?.target?.value
    console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ data', data)
    setInputData(data)
  }

  function addPhone() {
    let data = {...inputData}
    data.phones.push({number: ''})
    setInputData(data)
  }

  function deletePhone(phoneIndex: number) {
    let data = {...inputData}
    data.phones.splice(phoneIndex, 1)
    setInputData(data)
  }

  return (
    <div>
      <Heading1>Form</Heading1>
      <div>
        <div>First Name</div>
        <input type='text' id='addFirstName' placeholder='First Name...' />
      </div>
      <div>
        <div>Last Name</div>
        <input type='text' id='addLastName' placeholder='Last Name...' />
      </div>
      <div>
        <div>Phones</div> 
        {inputData?.phones?.map((phone: any, phoneIndex: number) => {
          return (
            <>
              <input key={phoneIndex} type='text' value={inputData?.phones?.[phoneIndex]?.number} onChange={(e)=> handlePhones(e, phoneIndex)} name='addPhone' placeholder={'Phone ' + (phoneIndex + 1) + '...'} />
              {inputData?.phones?.length > 1 &&
                <Button className="btn btn-danger" onClick={()=> deletePhone(phoneIndex)}>-</Button>
              }
            </>
          )
        })}
        <Button onClick={()=> addPhone()}>+</Button>
      </div>
      <Button onClick={()=> submitNew()}>Create New</Button>
      <NotificationContainer/>
    </div>
  );
}

export default FormContainer;
