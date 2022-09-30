import styled from '@emotion/styled';
import { css } from '@emotion/react'

const small = '12px'
const medium = '16px'
const large = '24px'
const mainColor = '#385b46a1'

const boxShadow = css({
    boxShadow: '0 -0.25em 0.25em -0.1em rgba(0, 0, 0, 0.1)'
})

export const Body = styled('div')`
  background: ${mainColor};
  font-size: ${medium};
`;

export const Container = styled('div')`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

export const ListWrapper = styled('div')`
  margin-top: ${large};
  padding: ${medium};
  background: #fff;
  border-radius: 10px;
  ${boxShadow}
`;