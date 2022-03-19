import {
  commonMaskImage,
  epicMaskImage,
  legendaryMaskImage,
  commonCrateIntroAnimation,
  epicCrateIntroAnimation,
  legendaryCrateIntroAnimation,
  commonCrateOpeningAnimation,
  epicCrateOpeningAnimation,
  legendaryCrateOpeningAnimation,
  commonCrateIdleImage,
  epicCrateIdleImage,
  legendaryCrateIdleImage,
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

export const CRATE_CARD_IDS = {
  NOTHING: 'nothing',
  POINTS: 0,
  NFT_START: 4,
  NFT_END: 13,
};

const NFT_GEAR_IDS = {
  PICKAXE: 4,
  OXYGEN_KIT: 5,
  GLOVES: 6,
  FLARE_GUN: 7,
  HEAT_CAPSULE: 8,
  SLIPPERS: 9,
  SUNGLASSES: 10,
  WATCH: 11,
  PROTEIN_BAR: 12,
  MED_KIT: 13,
};

export const NFT_GEARS = {
  [NFT_GEAR_IDS.PICKAXE]: {
    name: 'Pickaxe',
    boost: 10,
  },
  [NFT_GEAR_IDS.OXYGEN_KIT]: {
    name: 'Oxygen Kit',
    boost: 10,
  },
  [NFT_GEAR_IDS.GLOVES]: {
    name: 'Gloves',
    boost: 10,
  },
  [NFT_GEAR_IDS.FLARE_GUN]: {
    name: 'Flare Gun',
    boost: 10,
  },
  [NFT_GEAR_IDS.HEAT_CAPSULE]: {
    name: 'Heat Capsule',
    boost: 10,
  },
  [NFT_GEAR_IDS.SLIPPERS]: {
    name: 'Slippers',
    boost: 10,
  },
  [NFT_GEAR_IDS.SUNGLASSES]: {
    name: 'Sunglasses',
    boost: 10,
  },
  [NFT_GEAR_IDS.WATCH]: {
    name: 'Watch',
    boost: 10,
  },
  [NFT_GEAR_IDS.PROTEIN_BAR]: {
    name: 'Protein Bar',
    boost: 10,
  },
  [NFT_GEAR_IDS.MED_KIT]: {
    name: 'Med Kit',
    boost: 10,
  },
};

export const NFT_GAME_POINTS_DECIMALS = 5;

export const NFT_GAME_MODAL_THEMES = {
  [INVENTORY_TYPE.COMMON]: {
    backMask: commonMaskImage,
    backColor: 'white',
    buttonColor: 'rgba(0, 0, 0, 0.16)',
    foreColor: 'black',
    disabledForeColor: 'gray',
    idleImage: commonCrateIdleImage,
    pendingAnimation: commonCrateIntroAnimation,
    openingAnimation: commonCrateOpeningAnimation,
  },
  [INVENTORY_TYPE.EPIC]: {
    backMask: epicMaskImage,
    backColor: '#735CDD',
    buttonColor: 'rgba(255, 255, 255, 0.16)',
    foreColor: 'white',
    disabledForeColor: 'rgb(255, 255, 255, 0.5)',
    idleImage: epicCrateIdleImage,
    pendingAnimation: epicCrateIntroAnimation,
    openingAnimation: epicCrateOpeningAnimation,
  },
  [INVENTORY_TYPE.LEGENDARY]: {
    backMask: legendaryMaskImage,
    backColor: '#A5243D',
    buttonColor: 'rgba(255, 255, 255, 0.16)',
    foreColor: 'white',
    disabledForeColor: 'rgb(255, 255, 255, 0.5)',
    idleImage: legendaryCrateIdleImage,
    pendingAnimation: legendaryCrateIntroAnimation,
    openingAnimation: legendaryCrateOpeningAnimation,
  },
};
