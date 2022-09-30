import {ListWrapper, ContactPill, Heading2} from '../emotion'
import { GET_LIST } from '../hooks/useGetPosts';

import { gql, useQuery } from "@apollo/client";

function ListContainer() {
  const { loading, error, data: list } = useQuery(GET_LIST
  //   , {
  //   variables: {
  //     "where":  {
  //         "first_name": {"_like": "%John%" }
  //     }
  // },}
  );
  console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ list', list)

  // if (loading) return null;
  // if (error) return `Error! ${error}`;

  return (
    <ListWrapper>
      {list?.contact?.map((data: any, index: any) => {
        console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ index', index%4 === 0)
        return (
          <ContactPill>
            <Heading2>{data?.first_name} {data?.last_name}</Heading2>
          </ContactPill>

        )
      })}
    </ListWrapper>
  );
}

export default ListContainer;
