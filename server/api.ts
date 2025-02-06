import * as alt from 'alt-server';
import { useApi } from '@Server/api/index.js';
import { useRebar } from '@Server/index.js';
import { generateBatteryPercentage, generatePhoneNumber } from './modules/phoneMainModule.js';

const Rebar = useRebar();
const API_NAME = 'rebar-phone-api';

function usePhoneAPI() {
    const phoneCore = {
        generatePhone: generatePhoneNumber,
        generateBattery: generateBatteryPercentage,
    };

    return {
        phoneCore,
    };
}

declare global {
    export interface ServerPlugin {
        [API_NAME]: ReturnType<typeof usePhoneAPI>;
    }
}

useApi().register(API_NAME, usePhoneAPI());
