import React, { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { Image, Box, Flex } from 'rebass';

import { BREAKPOINTS, BREAKPOINT_NAMES, LANGUAGES, LANGUAGE_NAMES } from 'consts';
import { Label } from 'components/UI';
import { downArrowIcon, upArrowIcon } from 'assets/images';

import {
  DropDownItemContainer,
  DropDownHeader,
  DropDownItem,
  DropDownBackContainer,
} from './styles';

const LanguageDropdown = () => {
  const [isOpenLanguageDropDown, setIsOpenLanguageDropDown] = useState(false);
  const [selectedLanguage, setSelectedLanugage] = useState(LANGUAGES[LANGUAGE_NAMES.en]);

  const isMobile = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
  });

  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n) {
      const currentLanguage = i18n.language;
      console.log({ currentLanguage });
      setSelectedLanugage(LANGUAGES[currentLanguage]);
    }
  }, [i18n]);

  const onChangeLanguage = async lng => {
    i18n.changeLanguage(lng.alpha2);
    setSelectedLanugage(lng);
  };
  return (
    <Box
      ml={2}
      mr={2}
      sx={{ position: 'relative' }}
      tabIndex="0"
      onBlur={() => setIsOpenLanguageDropDown(false)}
    >
      <DropDownHeader
        onClick={() => setIsOpenLanguageDropDown(!isOpenLanguageDropDown)}
        isClicked={isOpenLanguageDropDown}
        hasBorder
        width={!isMobile ? '160px' : '80px'}
      >
        <Flex justifyContent="center" alignItems="center">
          <ReactCountryFlag countryCode={selectedLanguage?.flag} />
          {!isMobile && (
            <Label ml={2} color="#f5f5f5">
              {/* {selectedChain?.title ?? 'Switch network'} */}
              {selectedLanguage?.label}
            </Label>
          )}
        </Flex>
        <Image src={isOpenLanguageDropDown ? upArrowIcon : downArrowIcon} ml={2} width={11} />
      </DropDownHeader>
      {isOpenLanguageDropDown && (
        <DropDownBackContainer onClick={() => setIsOpenLanguageDropDown(false)}>
          <DropDownItemContainer width={!isMobile && !isTablet ? '128px' : '100%'}>
            {Object.keys(LANGUAGES)
              .filter(key => key !== selectedLanguage?.label)
              .map(key => (
                <DropDownItem key={key} onClick={() => onChangeLanguage(LANGUAGES[key])}>
                  <ReactCountryFlag countryCode={LANGUAGES[key].flag} />
                  <Label color="#f5f5f5" ml="8px">
                    {LANGUAGES[key].label}
                  </Label>
                </DropDownItem>
              ))}
          </DropDownItemContainer>
        </DropDownBackContainer>
      )}
    </Box>
  );
};

export default LanguageDropdown;
