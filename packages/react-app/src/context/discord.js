import { createContext } from 'react';
import Crate from '@widgetbot/crate';

const crate = new Crate({
  server: '808620015653879828', // FujiDAO - Team
  channel: '978623257005686824', // #test-bot-support
  indicator: true,
  notifications: true,
});
crate.hide();

const DiscordContext = createContext(crate);
// see https://docs.widgetbot.io/embed/crate/ for doc
DiscordContext.displayName = 'Discord widgetbot context (Crate instance)';

export default DiscordContext;
