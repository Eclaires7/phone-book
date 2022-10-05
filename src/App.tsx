import ListContainer from './containers/ListContainer'
import FormContainer from './containers/FormContainer'
import {Body, Container, Heading1} from './emotion'
import './App.css';

import {NotificationContainer} from 'react-notifications';
import React, {useState, useEffect, useMemo} from 'react';
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_LIST } from './hooks/useGetPosts';

function App() {
  const [list, setList] = useState<any[]>([]);
  const [listFav, setListFav] = useState<any[]>([]);
  const limit = 10;
  const [keyword, setKeyword] =  useState<string | null>('');
  const [page, setPage] = useState(1);
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
      let list = [...listPhone?.contact]
      const favourites = JSON.parse(localStorage.getItem('favourites') || '[]')
      if (favourites.length > 0) {
        let withoutFav = list
        let arrFinalFavourites : any[] = []
        
        Array.from(favourites)?.forEach((favourite: any) => {
          withoutFav = withoutFav?.filter((function (item: any) {
            return favourite?.id !== item?.id
          }))
          
          let arrFavourite = list?.find((function (item: any) {
            return favourite?.id === item?.id
          }))

          if (arrFavourite) {
            arrFavourite = {...arrFavourite, isFavourite: true}
            arrFinalFavourites = [...arrFinalFavourites, arrFavourite]
          }

          // sorting alphabetically favourites
          if (arrFavourite?.length > 0){
            arrFavourite?.sort((a, b) => {
              return a?.first_name?.localeCompare(b?.first_name)
            })
          }
        })
        setListFav(arrFinalFavourites)

        let arrWithProperty : any[] = []
        for(let element of withoutFav) {
          element = {...element, isFavourite: false}
          arrWithProperty.push(element)
        }

        withoutFav = arrWithProperty
        // sorting alphabetically general
        if(withoutFav?.length > 0) {
          withoutFav.sort((a, b) => {
            return a?.first_name?.localeCompare(b?.first_name)
          })
        }
        setList(withoutFav)
        handlePage(withoutFav)
      } else {
        setListFav([])
        // sorting alphabetically general
        if(list?.length > 0) {
          list.sort((a, b) => {
            return a?.first_name?.localeCompare(b?.first_name)
          })
        }
        setList(list)
        handlePage(list)
      }
    }
    // eslint-disable-next-line
  }, [listPhone, local])

  function handlePage(list:any) {
    if (page > 1) {
      if (list.length <= (10*(page-1)) ) { //handling page because of unordinary page changes   
        setPage(page - 1)
      } else setPage(page)
    } else setPage(page)
  }
  
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
        <ListContainer list={list} listFav={listFav} page={page} setPage={setPage} getList={getList} limit={limit} handleSearch={handleSearch} setLocal={setLocal} local={local} />
        <NotificationContainer/>
      </Container>
    </Body>
  );
}

export default App;
