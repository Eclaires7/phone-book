/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, {useState, useEffect} from 'react';
import { gql, useMutation } from "@apollo/client";
import {NotificationManager} from 'react-notifications';
import {Heading1, Heading2, FormWrapper} from '../emotion'
import {Button} from 'react-bootstrap';
import { POST_CONTACT } from "../hooks/useGetPosts";

function FormContainer({getList, checkUnique, dataUnique}) {
  const [inputData, setInputData] = useState({
    first_name: '',
    last_name : '',
    phones: [{number: ''}]
  })
  const [addContact, { data: addedContact }] = useMutation(POST_CONTACT)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if(addedContact?.insert_contact?.returning) {
      NotificationManager.success('Success Adding New Contact');
      setIsFormOpen(false)
      resetData()
      getList()
    }
  }, [addedContact])

  function resetData() {
    setInputData({
      first_name: '',
      last_name : '',
      phones: [{number: ''}]
    })
  }

  useEffect(() => {
    if(dataUnique?.contact?.length === 0) {
      submitNew()
    } else if (dataUnique?.contact?.length > 0) {
      NotificationManager.error('Name must be unique');
    }
  }, [dataUnique])

  function checkUniqueName() {
    const firstName = (document.getElementById('addFirstName') as HTMLInputElement).value
    const lastName = (document.getElementById('addLastName') as HTMLInputElement).value
    checkUnique({
      variables : {
        "where":  {
          _and: [
            { first_name: {"_like": `${firstName}` } }, 
            { last_name: {"_like": `${lastName}` } }
          ]
        }
      }
    ,})
  }

  function submitNew() {
    let error = ''
    const firstName = (document.getElementById('addFirstName') as HTMLInputElement).value
    const lastName = (document.getElementById('addLastName') as HTMLInputElement).value
    const regex = /^[A-Za-z0-9 ]+$/

    if (firstName === '' || lastName === '') {
      error = 'The input must not be empty'
    } else if (!regex.test(firstName)) {
      error = 'First name must not have special character'
    } else if (!regex.test(lastName)) {
      error = 'Last name must not have special character'
    }

    let data = inputData
    data.first_name = firstName
    data.last_name = lastName

    if (error === '') {
      data?.phones?.forEach((phone, idx) => {
        if (phone?.number === '') {
          error = `Input on phone ${idx+1} must not be empty`
        }
      });
    }

    if (error !== '') {
      NotificationManager.error(error, 'Error input', 3000);
    } else { 
      addContact({ variables: data })
    }
    
  }

  function handlePhones(e: any, phoneIndex: number) {
    let data = {...inputData}
    data.phones[phoneIndex].number = e?.target?.value
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

  if (!isFormOpen) {
    return (
      <Button onClick={()=> setIsFormOpen(true)}>New +</Button>
    )
  } else {
    return (
      <FormWrapper>
        <Heading1>Form</Heading1>
        <div css={css`margin-bottom: 8px`}>
          <Heading2>First Name</Heading2>
          <input type='text' id='addFirstName' placeholder='First Name...' />
        </div>
        <div css={css`margin-bottom: 8px`}>
          <Heading2>Last Name</Heading2>
          <input type='text' id='addLastName' placeholder='Last Name...' />
        </div>
        <div css={css`margin-bottom: 8px`}>
          <Heading2>Phones</Heading2>
          <div css={css`display: flex;flex-direction: column;align-items: flex-start;`}>
            {inputData?.phones?.map((phone: any, phoneIndex: number) => {
              return (
                <div>
                  <input key={phoneIndex} css={css`margin-bottom: 8px`} type='text' value={inputData?.phones?.[phoneIndex]?.number} onChange={(e)=> handlePhones(e, phoneIndex)} name='addPhone' placeholder={'Phone ' + (phoneIndex + 1) + '...'} />
                  {inputData?.phones?.length > 1 &&
                    <Button css={css`margin-left: 8px`} className="btn btn-danger" onClick={()=> deletePhone(phoneIndex)}>-</Button>
                  }
                </div>
              )
            })}
            <Button onClick={()=> addPhone()}>+</Button>
          </div>
        </div>
        <Button css={css`margin-right: 8px`} onClick={()=> checkUniqueName()}>Create New</Button>
        <Button className='btn btn-secondary' onClick={()=> {setIsFormOpen(false); resetData()}}>Cancel</Button>
      </FormWrapper>
    );
  }
}

export default FormContainer;
