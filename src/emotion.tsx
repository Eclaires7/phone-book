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
  color: #2e3134d6;
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
  justify-content: space-between;
`;

export const ContactPill = styled('div')`
  padding: ${medium};
  border-radius: ${small};
  background: #fff;
  flex: 1 0 30%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 30%;
  min-width: 200px;
  margin-bottom: ${small};
  margin-left: ${small};
  margin-right: ${small};
  cursor: pointer;
  ${boxShadow};
`;

export const Profile = styled('div')`
  background: #c75c5c;
  border-radius: 23px;
  padding: 12px;
  width: 46px;
  height: 46px;
  text-align: center;
  display: flex;
  align-items: center;
  color: #fff;
  margin-right: ${small};
`;

export const Information = styled('div')`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Description = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const Heading1 = styled('div')`
  font-weight: 600;
  font-size: 24px;
  width: max-content;
`;

export const Heading2 = styled('div')`
  font-weight: 600;
  width: max-content;
`;

export const FormWrapper = styled('div')`
  background: #fff;
  border-radius: ${small};
  padding: ${medium};
  ${boxShadow};
`;