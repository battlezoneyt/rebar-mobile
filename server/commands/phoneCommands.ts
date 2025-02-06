import alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { generatePhoneNumber } from '../modules/phoneMainModule.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();
const api = Rebar.useApi();

messenger.commands.register({
    name: 'gphoneno',
    desc: '/gphoneno to generate and asign a phone number',
    options: { permissions: ['admin'] },
    callback: async (player: alt.Player) => {
        try {
            const result = await generatePhoneNumber;
            console.log(result);
        } catch (err) {
            messenger.message.send(player, { type: 'warning', content: 'Somthing went wrong!.' });
        }
    },
});
