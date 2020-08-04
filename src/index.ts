import config from './config';
import Client from './lib/Client';

(async () => {
    const discordWSC = new Client(config);
})();