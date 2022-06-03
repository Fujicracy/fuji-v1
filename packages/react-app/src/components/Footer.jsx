import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { NavImageLink, NavTextLink, Label } from 'components/UI';
import { CONTACTS } from 'consts/contacts';
import { Box, Flex } from 'rebass';
import { map } from 'lodash';
import themeGet from '@styled-system/theme-get';

const NavText = styled.div`
  margin-right: 10px;
  font-size: 12px;

  color: ${themeGet('colors.text64')};

  &:hover {
    color: ${themeGet('colors.primary')};
  }
`;

function Footer() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <footer
      style={
        isHome
          ? {
              position: 'fixed',
              bottom: '0px',
              width: '100%',
            }
          : {
              bottom: '57px',
            }
      }
    >
      <Flex justifyContent="space-between" p="3">
        <Box border="1px solid red">
          {map(Object.keys(CONTACTS), key => (
            <NavImageLink key={key} contact={CONTACTS[key]} />
          ))}
        </Box>

        <Flex alignItems="center">
          <NavLink to="/about">
            <NavText>About</NavText>
          </NavLink>
          <NavTextLink url="https://docs.fujidao.org">Documentation</NavTextLink>
          <Label fontSize={12}>© FujiDAO {new Date().getFullYear()}</Label>
        </Flex>
      </Flex>
    </footer>
  );
}

export default Footer;
