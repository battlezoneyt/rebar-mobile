import * as alt from 'alt-shared';
import { T_ListOfApps } from './interface.js';

export const phoneConfig = {
    digits: 6,
    phoneAsItem: true,
    defaultApps: ['phone', 'message', 'gallery'] as Array<keyof T_ListOfApps>,
};
