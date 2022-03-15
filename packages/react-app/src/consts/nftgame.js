import {
  commonMaskImage,
  epicMaskImage,
  legendaryMaskImage,
  commonCrateIntroAnimation,
  epicCrateIntroAnimation,
  legendaryCrateIntroAnimation,
} from 'assets/images';

export const INVENTORY_TYPE = {
  COMMON: 'Common',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
};

export const CRATE_CONTRACT_IDS = {
  COMMON: 1,
  EPIC: 2,
  LEGENDARY: 3,
};

export const NFT_CARD_IDS = {
  START: 4,
  END: 11,
};

export const NFT_GAME_POINTS_DECIMALS = 5;

export const NFT_GAME_MODAL_THEMES = {
  [INVENTORY_TYPE.COMMON]: {
    backMask: commonMaskImage,
    backColor: 'white',
    buttonColor: 'rgba(0, 0, 0, 0.16)',
    foreColor: 'black',
    disabledForeColor: 'gray',
    pendingAnimation: commonCrateIntroAnimation,
  },
  [INVENTORY_TYPE.EPIC]: {
    backMask: epicMaskImage,
    backColor: '#735CDD',
    buttonColor: 'rgba(255, 255, 255, 0.16)',
    foreColor: 'white',
    disabledForeColor: 'rgb(255, 255, 255, 0.5)',
    pendingAnimation: epicCrateIntroAnimation,
  },
  [INVENTORY_TYPE.LEGENDARY]: {
    backMask: legendaryMaskImage,
    backColor: '#A5243D',
    buttonColor: 'rgba(255, 255, 255, 0.16)',
    foreColor: 'white',
    disabledForeColor: 'rgb(255, 255, 255, 0.5)',
    pendingAnimation: legendaryCrateIntroAnimation,
  },
};
