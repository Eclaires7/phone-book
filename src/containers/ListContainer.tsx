/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, {useState, useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
import {Modal, Button} from 'react-bootstrap';

import {ListWrapper, Heading1} from '../emotion'
import { GET_LIST } from '../hooks/useGetPosts';
import ContactPillComponent from '../components/ContactPillComponent'

function ListContainer() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [keyword, setKeyword] =  useState<string | null>('');
  console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ keyword', keyword)
  const [clickIndex, setClickIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = (dataIndex: any) => {
    setClickIndex(dataIndex)
    setShow(true)
  };
  const { loading, error, data: listPhone, refetch: getList } = useQuery(GET_LIST
  //   , {
  //   variables: {
  //     "where":  {
  //         "first_name": {"_like": "%John%" }
  //     }
  // },}
  );

  useEffect(() => {
    setList(listPhone?.contact)
  }, [listPhone])
  console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ list', list)

  useEffect(() => {
    getList({
      "where":  {
        _or: [
          { first_name: {"_like": `%${keyword}%` } }, 
          { last_name: {"_like": `%${keyword}%` } }, 
          { phones: {number: {"_like": `%${keyword}%` }} }, 
        ]
      }
    ,})
  }, [keyword])

  function handleSearch() {
    const keyword = (document.getElementById('search') as HTMLInputElement).value
    setKeyword(keyword)
  }

  return (
    <div>
      <hr />
      <div>
        <input type='text' css={css`height: 35px`} id='search' placeholder='keyword...' />
        <Button css={css`margin-left: 8px`} onClick={()=> handleSearch()}>Search</Button>
      </div>
      {/* paginationnya gimana? per fav apa gmn */}
      <Heading1>Favourites</Heading1>
      <ListWrapper>
        {list?.map((data: any, dataIndex: any) => {
          return (
            <ContactPillComponent key={dataIndex} data={data} dataIndex={dataIndex} handleShow={handleShow} isFavourite />
          )
        })}
      </ListWrapper>
      <Heading1>Contacts</Heading1>
      <ListWrapper>
        {list?.map((data: any, dataIndex: any) => {
          return (
            <ContactPillComponent key={dataIndex} data={data} dataIndex={dataIndex} handleShow={handleShow} />
          )
        })}
      </ListWrapper>
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
              <div key={phoneIndex}>
                {phone?.number}
              </div>
            )
          })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>
      }
    </div>
  );
}

export default ListContainer;
