import { createContext } from 'react';
import Crate from '@widgetbot/crate';

const crate = new Crate({
  server: '833590270599233566', // Fuji DAO
  channel: '844166216414527548', // #❓︱community-questions
  indicator: true,
  notifications: true,
});
crate.hide();

const DiscordContext = createContext(crate);
// see https://docs.widgetbot.io/embed/crate/ for doc
DiscordContext.displayName = 'Discord widgetbot context (Crate instance)';

export default DiscordContext;
