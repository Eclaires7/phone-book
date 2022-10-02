import ListContainer from './containers/ListContainer'
import FormContainer from './containers/FormContainer'
import {Body, Container, Heading1} from './emotion'
import './App.css';

import {NotificationContainer} from 'react-notifications';
import React, {useState, useEffect, useMemo} from 'react';
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { GET_LIST } from './hooks/useGetPosts';

function App() {
  const [list, setList] = useState<any[]>([]);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [keyword, setKeyword] =  useState<string | null>('');

  const paramGetList = useMemo(() => ({
    "where": keyword !== '' ? {
      _or: [
        { first_name: {"_like": `%${keyword}%` } }, 
        { last_name: {"_like": `%${keyword}%` } }, 
        { phones: {number: {"_like": `%${keyword}%` }} }, 
      ]
    } : undefined
  }), [offset, keyword])

  const {data: listPhone, refetch: getList} = useQuery(GET_LIST
    , {variables: paramGetList,}
  );
  const [checkUnique, { data: dataUnique }] = useLazyQuery(GET_LIST);

  useEffect(() => {
    setList(listPhone?.contact)
  }, [listPhone])
  
  function handleSearch() {
    const keyword = (document.getElementById('search') as HTMLInputElement).value
    setKeyword(keyword)
  }

  return (
    <Body>
      <Container>
        <Heading1>Phone Book</Heading1>
        <hr />
        <FormContainer getList={getList} checkUnique={checkUnique} dataUnique={dataUnique} />
        <ListContainer list={list} getList={getList} limit={limit} handleSearch={handleSearch} />
        <NotificationContainer/>
      </Container>
    </Body>
  );
}

export default App;
