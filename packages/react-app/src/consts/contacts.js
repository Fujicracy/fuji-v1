import {
  discordImage,
  discordRedImage,
  telegramImage,
  telegramRedImage,
  twitterImage,
  twitterRedImage,
} from 'assets/images';

export const CONTACTS = {
  TWITTER: {
    id: 'twitter',
    url: 'https://twitter.com/FujiFinance',
    image: twitterImage,
    imageHover: twitterRedImage,
    alt: 'twitter',
  },
  DISCORD: {
    id: 'discord',
    url: 'https://discord.com/invite/dnvJeEMeDJ',
    image: discordImage,
    imageHover: discordRedImage,
    alt: 'discord',
  },
  TELEGRAM: {
    id: 'telegram',
    url: 'https://t.me/joinchat/U4cKWNCUevKVsrtY',
    image: telegramImage,
    imageHover: telegramRedImage,
    alt: 'telegram',
  },
};
