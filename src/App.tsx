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
  // console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ list', list)
  const limit = 10;
  const [keyword, setKeyword] =  useState<string | null>('');
  const [local, setLocal] = useState(localStorage.getItem('favourites'))

  const paramGetList = useMemo(() => ({
    "where": keyword !== '' ? {
      _or: [
        { first_name: {"_like": `%${keyword}%` } }, 
        { last_name: {"_like": `%${keyword}%` } }, 
        { phones: {number: {"_like": `%${keyword}%` }} }, 
      ]
    } : undefined
  }), [keyword])

  const {data: listPhone, refetch: getList} = useQuery(GET_LIST
    , {variables: paramGetList,}
  );
  const [checkUnique, { data: dataUnique }] = useLazyQuery(GET_LIST);

  useEffect(() => {
    if(listPhone !== undefined) {
      let list = listPhone?.contact
      const favourites = JSON.parse(localStorage.getItem('favourites') || '[]')
      let withoutFav : any[] = []
      if (favourites.length > 0) {
        let arr = []

        favourites?.map((favourite: any) => { 
          console.log(favourite,'favourite');
          
          arr = list?.filter((function (item: any) {
            return favourite?.id !== item?.id
          }))
        })

        withoutFav = arr
        let arrWithProperty : any[] = []
        for(let element of withoutFav) {
          element = {...element, isFavourite: false}
          arrWithProperty.push(element)
        }

        withoutFav = arrWithProperty
        favourites?.map((favourite: any) => (
          withoutFav = [...withoutFav, favourite]
        ))
        
        // sorting from fav to general
        withoutFav.sort(x => x.isFavourite ? -1 : 1)
        setList(withoutFav)
      } else {
        setList(list)
      }
    }
  }, [listPhone, local])
  
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
        <ListContainer list={list} getList={getList} limit={limit} handleSearch={handleSearch} setLocal={setLocal} />
        <NotificationContainer/>
      </Container>
    </Body>
  );
}

export default App;
