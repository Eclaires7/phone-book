/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, {FC} from 'react'

import {ContactPill, Heading2, Profile, Description, Information} from '../emotion'

type Props = {
  data: any,
  dataIndex: any,
  handleShow: any,
  isFavourite?: boolean
};

const ContactPillComponent: FC<Props> = ({data, dataIndex, handleShow, isFavourite}) => {
  return (
    <ContactPill onClick={()=> handleShow(dataIndex)}>
        <Profile>{data?.first_name?.substring(0,1).toUpperCase()}{data?.last_name?.substring(0,1).toUpperCase()}</Profile>
        <Information>
            <Description>
            <Heading2>{data?.first_name} {data?.last_name}</Heading2>
            <div css={css`margin-top: 8px;font-size: 12px`}>
                <div>{data?.phones?.length} saved number</div>
                {/* {data?.phones?.map((phone: any, phoneIndex: any) => {
                return (
                    <div>{phone?.number}</div>
                    )
                })} */}
            </div>
            </Description>
            {isFavourite &&
              <img src="https://img.icons8.com/color/48/000000/filled-like.png" width={15} height={15} /> 
            }
        </Information>
    </ContactPill>
  );
}

export default ContactPillComponent;
