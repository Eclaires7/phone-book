import styled from '@emotion/styled';
import { css } from '@emotion/react'

const small = '12px'
const medium = '16px'
const large = '24px'
const darkColor = '#385b46a1'
const lightColor = '#470f0f1f'
const bold = '600'

const boxShadow = css({
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;})'
})

export const Body = styled('div')`
  font-size: ${medium};
  height: 100vh;
  color: #2e3134d6;
  background: ${lightColor};
  font-family: 'Open Sauce One',sans-serif;
`;

export const Container = styled('div')`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

export const ListWrapper = styled('div')`
  margin-top: ${large};
  display: flex;
  flex-wrap: wrap;
`;

// cek media kalo lbh kecil dari apa baru kasih min-width
export const ContactPill = styled('div')`
  padding: ${medium};
  border-radius: ${small};
  background: #fff;
  flex: 1 0 25%;
  min-width: 200px;
  margin-bottom: ${small};
  margin-left: ${small};
  margin-right: ${small};
  ${boxShadow}
`;

export const Heading2 = styled('div')`
  font-weight: 600;
  width: max-content;
`;