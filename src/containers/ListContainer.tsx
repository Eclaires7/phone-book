/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMutation } from "@apollo/client";
import {Modal, Button} from 'react-bootstrap';
import React, {useState, useEffect, useMemo} from 'react';
import { PaginatedList } from "react-paginated-list";
import {NotificationManager} from 'react-notifications';

import {ListWrapper} from '../emotion'
import { DELETE_CONTACT, POST_NUMBER } from '../hooks/useGetPosts';
import ContactPillComponent from '../components/ContactPillComponent'

function ListContainer({list, getList, limit, handleSearch, setLocal}) {
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [clickIndex, setClickIndex] = useState(0);
  const modifiedClickIndex = useMemo(() => {
    return page === 1 ? clickIndex : clickIndex + (10 * (page-1))
  }, [clickIndex])
  console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ clickIndex', clickIndex)
  console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ modifiedClickIndex', modifiedClickIndex)
  const [newNumber, setNewNumber] = useState({isNewNumber: false, number: ''})

  const handleClose = () => setShow(false);
  const handleShow = (dataIndex: any) => {
    setClickIndex(dataIndex)
    setShow(true)
  };
  
  const [addNewNumber, {data: dataAdded}] = useMutation(POST_NUMBER)
  const [deleteContact, {data: dataDeleted}] = useMutation(DELETE_CONTACT)

  useEffect(() => {
    if(dataDeleted?.delete_contact_by_pk?.id === list?.[modifiedClickIndex]?.id && dataDeleted?.delete_contact_by_pk?.id !== undefined) {
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
        "contact_id": list?.[modifiedClickIndex]?.id,
        "phone_number": newNumber
      }})
      setNewNumber({isNewNumber: false, number: ''})
    } else {
      NotificationManager.error('Number must not be empty')
    }
  }

  function handleDeleteContact() {
    deleteContact({variables: {id: list?.[modifiedClickIndex]?.id}})
  }

  function handleFavourite() {
    let favourites = localStorage.getItem('favourites')
    let contact = {...list?.[modifiedClickIndex]}
    contact.isFavourite = true

    if (favourites === null || favourites?.length === 0) { //new
      localStorage.setItem('favourites', JSON.stringify([contact]))
      setLocal(JSON.stringify([contact]))
    } else {
      let arr : any[] = []
      arr = JSON.parse(favourites)
      const exist = arr?.findIndex(element => element?.id === contact?.id)
      if (exist === -1) { //add to local storage
        arr = [...arr, contact]
      } else { //remove from local storage
        arr.splice(exist, 1)
      }
      localStorage.setItem('favourites', JSON.stringify(arr))
      setLocal(JSON.stringify(arr))
    }
    handleClose()
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
        onPageChange={(items: any, currentPage: number) => setPage(currentPage)}
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
            <Modal.Title>{list?.[modifiedClickIndex]?.first_name} {list?.[modifiedClickIndex]?.last_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {list?.[modifiedClickIndex]?.phones?.map((phone: any, phoneIndex: any) => {
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
            <Button className='btn btn-warning' onClick={()=>handleFavourite()}>{list?.[modifiedClickIndex]?.isFavourite ? 'Unfavourite' : 'Favourite'}</Button>
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
