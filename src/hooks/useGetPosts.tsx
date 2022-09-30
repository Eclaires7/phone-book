import { gql, useQuery } from "@apollo/client";
import { Post } from "../common/post.interface";

export const GET_LIST = gql`
      query GetContactList($distinct_on: [contact_select_column!], $limit: Int, $offset: Int, $order_by: [contact_order_by!], $where: contact_bool_exp) {
          contact(
            distinct_on: $distinct_on
            limit: $limit
            offset: $offset
            order_by: $order_by
            where: $where
          ) {
          created_at
          first_name
          id
          last_name
          phones {
            number
          }
          }
      }
  `
// export const useGetPosts = (): Post[] | undefined => {
//     const { data } = useQuery(GET_LIST, {
//         variables: { options: { paginate: { page: 1, limit: 10 } } }
//     });
//     return data?.posts?.data;
// }