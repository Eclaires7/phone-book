import { gql } from "@apollo/client";

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

export const POST_CONTACT = gql`
      mutation AddContactWithPhones(
        $first_name: String!, 
        $last_name: String!, 
        $phones: [phone_insert_input!]!
        ) {
        insert_contact(
            objects: {
                first_name: $first_name, 
                last_name: 
                $last_name, phones: { 
                    data: $phones
                  }
              }
          ) {
        returning {
          first_name
          last_name
          id
          phones {
            number
          }
        }
        }
      }
`

export const POST_NUMBER = gql`
      mutation AddNumberToContact ($contact_id: Int!, $phone_number:String!) {
        insert_phone(objects: {contact_id: $contact_id, number: $phone_number}) {
          returning {
            contact {
              id
              last_name
              first_name
              phones {
                number
              }
            }
          }
        }
      }
`

export const DELETE_CONTACT = gql`
      mutation MyMutation($id: Int!) {
        delete_contact_by_pk(id: $id) {
          first_name
          last_name
          id
        }
      }
`