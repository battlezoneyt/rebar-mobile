import * as alt from 'alt-shared';

declare module '@Shared/types/character.js' {
    export interface Character {
        phoneId?: string;
    }
}

export interface IPhoneCore {
    _id: string;
    phoneno: number;
    characterId: string;
    battery: number;
    apps: IPhoneApp[];
}

export interface IPhone extends IPhoneCore {
    settings?: {
        wallpaper?: 'default';
        ringtone?: 'default';
        isAirplaneMode?: false;
        isDoNotDisturb?: false;
        isDarkMode?: false;
        isMuted?: false;
    };
    passcode?: number;
    simProvider?: keyof T_ListOfSimProviders;
}

export interface T_ListOfSimProviders {
    mtn: 1;
    tigo: 2;
    vodafone: 3;
}

export interface IPhoneApp<T extends keyof T_ListOfApps = keyof T_ListOfApps> {
    name: T;
    status: keyof T_PhoneAppStatus;
    data?: T_AppData[T];
}

export interface T_PhoneAppStatus {
    installed: 1;
    notinstalled: 2;
    disabled: 3;
}

export interface T_ListOfApps {
    phone: 1;
    message: 2;
    banking: 3;
    gallery: 4;
}

type T_AppData = {
    phone: IPhoneAppData;
    message: IMessagesAppData;
    banking: IBankingAppData;
    gallery: IGalleryAppData;
};

interface IMessagesAppData {
    conversationId?: string;
}

interface IBankingAppData {
    balance?: number;
    transactions?: Array<{
        id: string;
        amount: number;
        timestamp: number;
    }>;
}

interface IPhoneAppData {
    contacts?: Array<{
        name: string;
        number: number;
    }>;
}

interface IGalleryAppData {
    photos?: Array<{
        id: string;
        url: string;
    }>;
}
