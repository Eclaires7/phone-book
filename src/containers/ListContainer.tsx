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

function ListContainer({list, listFav, page, setPage, getList, limit, handleSearch, setLocal, local}) {
  const [show, setShow] = useState(false);
  const [clickIndex, setClickIndex] = useState(0);
  const [clickType, setClickType] = useState('general');
  const [newNumber, setNewNumber] = useState({isNewNumber: false, number: ''})
  const currentList = clickType === 'general' ? list?.[clickIndex] : listFav?.[clickIndex]

  const handleClose = () => setShow(false);
  const handleShow = (dataIndex: number, type: string) => {
    if(type === 'general') {
      setClickIndex(page === 1 ? dataIndex : dataIndex + (10 * (page-1)))
    } else setClickIndex(dataIndex)
    setClickType(type)
    setShow(true)
  };
  
  const [addNewNumber] = useMutation(POST_NUMBER)
  const [deleteContact, {data: dataDeleted}] = useMutation(DELETE_CONTACT)

  useEffect(() => {
    if(dataDeleted?.delete_contact_by_pk?.id === currentList?.id && dataDeleted?.delete_contact_by_pk?.id !== undefined) {
      let aa = JSON.parse(local)
      const remainingLocal = aa?.filter((function (item: any) {
        return dataDeleted?.delete_contact_by_pk?.id !== item?.id
      }))

      localStorage.setItem('favourites', JSON.stringify(remainingLocal))
      setLocal(JSON.stringify(remainingLocal))
      handleClose()
      NotificationManager.success('Delete Success')
      getList()
    }
    // eslint-disable-next-line
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
        "contact_id": currentList?.id,
        "phone_number": newNumber
      }})
      setNewNumber({isNewNumber: false, number: ''})
    } else {
      NotificationManager.error('Number must not be empty')
    }
  }

  function handleDeleteContact() {
    deleteContact({variables: {id: currentList?.id}})
  }

  function handleFavourite() {
    let favourites = localStorage.getItem('favourites')
    let contact = {...currentList}
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
      <ListWrapper>
        {listFav?.map((data: any, dataIndex: any) => {
          return (
            <ContactPillComponent key={dataIndex} data={data} dataIndex={dataIndex} handleShow={handleShow} type='fav' />
            )
          })}
      </ListWrapper>
      {list !== undefined && list?.length > 0 &&
        <PaginatedList
        list={list}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={(items: any, currentPage: number) => setPage(currentPage)}
        renderList={(item) => (
          <ListWrapper>
              {item?.map((data: any, dataIndex: any) => {
                return (
                  <ContactPillComponent key={dataIndex} data={data} dataIndex={dataIndex} handleShow={handleShow} type='general' />
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
            <Modal.Title>{currentList?.first_name} {currentList?.last_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentList?.phones?.map((phone: any, phoneIndex: any) => {
              return (
                <>
                  <div key={phoneIndex} css={css`display:flex;justify-content: space-between`}>
                    <div>{phone?.number}</div>
                    <div>
                      <img src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png" alt='img-profile' css={css`cursor:pointer`} width={15} height={15} />
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
            <Button className='btn btn-warning' onClick={()=>handleFavourite()}>{currentList?.isFavourite ? 'Unfavourite' : 'Favourite'}</Button>
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
