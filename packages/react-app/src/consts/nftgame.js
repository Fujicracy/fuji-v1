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

export const CRATE_TYPE = {
  COMMON: 'Common',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
};

export const CRATE_IDS = {
  COMMON: 1,
  EPIC: 2,
  LEGENDARY: 3,
};

export const GEAR_IDS = {
  START: 4,
  END: 8,
};

export const NFT_IDS = {
  NOTHING: 'nothing',
  POINTS: 0,
  COMMON_CRATE: 1,
  EPIC_CRATE: 2,
  LEGENDARY_CRATE: 3,
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

export const NFT_ITEMS = {
  [NFT_IDS.PICKAXE]: {
    name: 'Pickaxe',
    description:
      'The Pickaxe will help you maintain a grip. When you reach higher highs, it will let you overpass the hardest obstacles along the road.',
    boost: [10, 15, 17, 18],
    images: {
      small: 'https://storage.googleapis.com/fuji-game-resources/gears-200/pickaxe-200.png',
      medium: 'https://storage.googleapis.com/fuji-game-resources/gears-full/pickaxe-full.png',
    },
  },
  [NFT_IDS.OXYGEN_KIT]: {
    name: 'Oxygen Kit',
    description:
      'Reaching higher highs is not easy. You will find the Oxygen Kit very helpful when you are out of breath near the top of the mountain.',
    boost: [10, 15, 17, 18],
    images: {
      small: 'https://storage.googleapis.com/fuji-game-resources/gears-200/oxykit-200.png',
      medium: 'https://storage.googleapis.com/fuji-game-resources/gears-full/oxykit-full.png',
    },
  },
  [NFT_IDS.GLOVES]: {
    name: 'Gloves',
    description:
      'How would it be to climb without gloves? Very painfull, of course. Fuji Gloves will ensure your fingers remain attached to your hand.',
    boost: [10, 15, 17, 18],
    images: {
      small: 'https://storage.googleapis.com/fuji-game-resources/gears-200/exogloves-200.png',
      medium: 'https://storage.googleapis.com/fuji-game-resources/gears-full/gloves-full.png',
    },
  },
  [NFT_IDS.FLARE_GUN]: {
    name: 'Flare Gun',
    description:
      'In case of emergency during the climb, shoot with your Flare Gun to ask your peers for assistance.',
    boost: [10, 15, 17, 18],
    images: {
      small: 'https://storage.googleapis.com/fuji-game-resources/gears-200/flaregun-200.png',
      medium: 'https://storage.googleapis.com/fuji-game-resources/gears-full/flaregun-full.png',
    },
  },
  [NFT_IDS.HEAT_CAPSULE]: {
    name: 'Heat Capsule',
    description:
      'The Heat Capsule will keep you warm and alive each time the temperature decreases to extreme lows.',
    boost: [10, 15, 17, 18],
    images: {
      small: 'https://storage.googleapis.com/fuji-game-resources/gears-200/heatcapsule-200.png',
      medium: 'https://storage.googleapis.com/fuji-game-resources/gears-full/heatcapsule-full.png',
    },
  },
  [NFT_IDS.SLIPPERS]: {
    name: 'Slippers',
    description:
      'Adapted from the ancient Fuji Flops, those used by the first Fuji Climbers in the history. Slippers let you climb in a comfy manner and keep you focused on the road instead of your cold feet.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.SUNGLASSES]: {
    name: 'Sunglasses',
    description:
      'The Sunglasses equipped with laser vision will let you foresee the obstacles and swiftly find solutions to your challenges.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.WATCH]: {
    name: 'Watch',
    description:
      'Alone in a hostile environment, you can easily lose the notion of time. The Watch will keep you mind sain and will also indicate the most important metrics such as your altitude and your speed.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.PROTEIN_BAR]: {
    name: 'Protein Bar',
    description:
      'The Protein Bar is a must-have during the climb. In fact, without it, you might find yourself eating your peers... It’s not what you want, right?',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.MED_KIT]: {
    name: 'Med Kit',
    description:
      'The Med Kit is here to support you during the hardest times. It has everything you might need to cure your body and soul.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
};

export const NFT_GAME_POINTS_DECIMALS = 9;

export const NFT_GAME_MODAL_THEMES = {
  [CRATE_TYPE.COMMON]: {
    backMask: commonMaskImage,
    backColor: 'white',
    buttonColor: 'rgba(0, 0, 0, 0.16)',
    foreColor: 'black',
    disabledForeColor: 'gray',
    idleImage: commonCrateIdleImage,
    pendingAnimation: commonCrateIntroAnimation,
    openingAnimation: commonCrateOpeningAnimation,
  },
  [CRATE_TYPE.EPIC]: {
    backMask: epicMaskImage,
    backColor: '#735CDD',
    buttonColor: 'rgba(255, 255, 255, 0.16)',
    foreColor: 'white',
    disabledForeColor: 'rgb(255, 255, 255, 0.5)',
    idleImage: epicCrateIdleImage,
    pendingAnimation: epicCrateIntroAnimation,
    openingAnimation: epicCrateOpeningAnimation,
  },
  [CRATE_TYPE.LEGENDARY]: {
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
