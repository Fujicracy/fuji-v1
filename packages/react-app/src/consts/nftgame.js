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
      'The Pickaxe will help you maintain a grip. When you reach the higher highs, you’ll need them to overpass the hardest obstacles along the road.',
    boost: [10, 15, 17, 18],
    images: {
      small:
        'https://ipfs.fleek.co/ipfs/bafybeifthyg7tmh6g55qu77ih4kq7qnpvoinlcnttano3ifof2i2znpina',
      medium:
        'https://ipfs.fleek.co/ipfs/bafybeiceaehfh4p7jejththcaeadbamztagqhimqjhzo2otgmovinbx6n4',
    },
  },
  [NFT_IDS.OXYGEN_KIT]: {
    name: 'Oxygen Kit',
    description:
      'Reaching the higher highs is not easy, you’ll find the Oxygen Kit very helpful when you are out of breath near the top of the mountain.',
    boost: [10, 15, 17, 18],
    images: {
      small:
        'https://ipfs.fleek.co/ipfs/bafybeichno5r55c2wgw2abdohuch7my2b3wvvrgwypp2azccagltqw2mne',
      medium:
        'https://ipfs.fleek.co/ipfs/bafybeighjgji4bhbqkrx5czdwvspgm6hyubdip6uu5t4db6zkkf6rnxuhy',
    },
  },
  [NFT_IDS.GLOVES]: {
    name: 'Gloves',
    description:
      'What would be a climbing without gloves? Not a climbing of course. Fuji Gloves will ensure your fingers remain attached to your hand, all the way to the top.',
    boost: [10, 15, 17, 18],
    images: {
      small:
        'https://ipfs.fleek.co/ipfs/bafybeiftaklgesfljkrpd5g7rinitxtqvelo7vjshrqvzmzfcxbbpey7by',
      medium:
        'https://ipfs.fleek.co/ipfs/bafybeigvlaagna77fdibkgs27jxo3law2cey6ui5brqnhoqtnikyunacze',
    },
  },
  [NFT_IDS.FLARE_GUN]: {
    name: 'Flare Gun',
    description:
      'In case of sudden emergency during the climbing, shoot with your Fuji Pistol to show your peers you need some assistance.',
    boost: [10, 15, 17, 18],
    images: {
      small:
        'https://ipfs.fleek.co/ipfs/bafybeiaghca5qlzsijcz6wlbse2aik7qwsvwyywsrh2v7bpzicpq6ypr54',
      medium:
        'https://ipfs.fleek.co/ipfs/bafybeicau6ab7dlj3zu5tm26qrmqx7t3a6i6pxsbgoixv3vtksrotwiu5u',
    },
  },
  [NFT_IDS.HEAT_CAPSULE]: {
    name: 'Heat Capsule',
    description:
      'The heat capsule will keep you warm and alive each time the temperature decreases to the extreme lows.',
    boost: [10, 15, 17, 18],
    images: {
      small:
        'https://ipfs.fleek.co/ipfs/bafybeih2keg45qi6kjonfn5xvbi2m2njb25qzcyv3fxtbubriikc5uz54y',
      medium:
        'https://ipfs.fleek.co/ipfs/bafybeiabt7es5q65qdwp7dns55akbspmvteg5oie4fmezhw2smfywnmkna',
    },
  },
  [NFT_IDS.SLIPPERS]: {
    name: 'Slippers',
    description:
      'Adapted from the ancient Fuji Flops, those used by the first Fuji Climbers in the history. They’ll let you climb in a comfy manner, and keep your focus on the road instead of your cold feet.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.SUNGLASSES]: {
    name: 'Sunglasses',
    description:
      'These sunglasses will let you foresee the obstacles you might encounter, and solutions to your challenges at a faster pace. This is technology of the future; equipped laser vision.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.WATCH]: {
    name: 'Watch',
    description:
      'Each expedition needs its watch. It will follow you during the whole journey, indicating the most important metrics such as your altitude and your speed.',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.PROTEIN_BAR]: {
    name: 'Protein Bar',
    description:
      'The protein bar is a must have during the climbing, in fact, without it, you’ll have to eat your peers, it’s not what you want, right?',
    boost: [10, 15, 17, 18],
    images: {
      small: '',
      medium: '',
    },
  },
  [NFT_IDS.MED_KIT]: {
    name: 'Med Kit',
    description:
      'The Med Kit is here to support you during hard times, maintain your health the longer you can during the climbing to avoid having to use it.',
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
