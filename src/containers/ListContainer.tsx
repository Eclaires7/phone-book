/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMutation } from "@apollo/client";
import {Modal, Button} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import { PaginatedList } from "react-paginated-list";
import {NotificationManager} from 'react-notifications';

import {ListWrapper} from '../emotion'
import { DELETE_CONTACT, POST_NUMBER } from '../hooks/useGetPosts';
import ContactPillComponent from '../components/ContactPillComponent'

function ListContainer({list, getList, limit, handleSearch}) {
  const [show, setShow] = useState(false);
  const [clickIndex, setClickIndex] = useState(0);
  const [newNumber, setNewNumber] = useState({isNewNumber: false, number: ''})

  const handleClose = () => setShow(false);
  const handleShow = (dataIndex: any) => {
    setClickIndex(dataIndex)
    setShow(true)
  };
  
  const [addNewNumber, {data: addLastName}] = useMutation(POST_NUMBER)
  const [deleteContact, {data: dataDeleted}] = useMutation(DELETE_CONTACT)

  useEffect(() => {
    if(dataDeleted?.delete_contact_by_pk?.id === list?.[clickIndex]?.id && dataDeleted?.delete_contact_by_pk?.id !== undefined) {
      handleClose()
      NotificationManager.success('Delete Success')
      getList()
    }
  }, [dataDeleted])

  useEffect(() => {
    if(!show) {
      setNewNumber({isNewNumber: false, number: ''})
    }
  }, [show])

  function addNumber() {
    const newNumber = (document.getElementById('newNumber') as HTMLInputElement).value

    if (newNumber !== '') { 
      addNewNumber({variables: {
        "contact_id": list?.[clickIndex]?.id,
        "phone_number": newNumber
      }})
      setNewNumber({isNewNumber: false, number: ''})
    } else {
      NotificationManager.error('Number must not be empty')
    }
  }

  function handleDeleteContact() {
    deleteContact({variables: {id: list?.[clickIndex]?.id}})
  }

  function handleFavourite() {
    let favourites = localStorage.getItem('favourites')
    let contact = {...list?.[clickIndex]}
    contact.isFavourite = true

    if (favourites === null || favourites?.length === 0) { //new
      localStorage.setItem('favourites', JSON.stringify([contact]))
    } else {
      let arr : any[] = []
      arr = JSON.parse(favourites)
      const exist = arr?.findIndex(element => element?.id === contact?.id)
      if (exist === -1) { //add to local storage
        arr = [...arr, contact]
      } else { //remove from local storage
        arr = arr.splice(exist, 1)
      }
      localStorage.setItem('favourites', JSON.stringify(arr))
    }
    handleClose()
    getList() //cek ud bner belom
  }

  return (
    <div>
      <hr />
      <div>
        <input type='text' css={css`height: 35px`} id='search' placeholder='keyword...' />
        <Button css={css`margin-left: 8px`} onClick={()=> handleSearch()}>Search</Button>
      </div>
      {list !== undefined && list?.length > 0 &&
        <PaginatedList
        list={list}
        itemsPerPage={limit}
        renderList={(item) => (
          <ListWrapper>
              {item?.map((data: any, dataIndex: any) => {
                return (
                  <ContactPillComponent key={dataIndex} data={data} dataIndex={dataIndex} handleShow={handleShow} />
                  )
                })}
            </ListWrapper>
          )}
        />
      }
      {show &&
        <Modal
          show={show}
          centered
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{list?.[clickIndex]?.first_name} {list?.[clickIndex]?.last_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {list?.[clickIndex]?.phones?.map((phone: any, phoneIndex: any) => {
              return (
                <>
                  <div key={phoneIndex} css={css`display:flex;justify-content: space-between`}>
                    <div>{phone?.number}</div>
                    <div>
                      <img src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png" css={css`cursor:pointer`} width={15} height={15} />
                    </div>
                  </div>
                  <hr />
                </>
              )
            })}
            {newNumber?.isNewNumber
              ? <input placeholder='new number...' id='newNumber' />
              : <Button onClick={()=> setNewNumber({isNewNumber: true, number: ''})}>+</Button>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button className='btn btn-warning' onClick={()=>handleFavourite()}>Favourite</Button>
            {!newNumber?.isNewNumber &&
              <Button className='btn btn-danger' onClick={()=>handleDeleteContact()}>
                Delete Contact
              </Button>
            }
            {newNumber?.isNewNumber &&
              <Button variant="primary" onClick={()=> addNumber()}>Add Number</Button>
            }
          </Modal.Footer>
        </Modal>
      }
    </div>
  );
}

export default ListContainer;
