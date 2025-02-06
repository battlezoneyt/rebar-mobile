import alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { createNewPhone, generatePhoneNumber } from '../modules/phoneMainModule.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();
const api = Rebar.useApi();

messenger.commands.register({
    name: 'createphone',
    desc: '/createphone to generate and asign a phone number',
    options: { permissions: ['admin'] },
    callback: async (player: alt.Player) => {
        try {
            const result = await createNewPhone(player);
            console.log(result);
        } catch (err) {
            messenger.message.send(player, { type: 'warning', content: 'Somthing went wrong!.' });
        }
    },
});
