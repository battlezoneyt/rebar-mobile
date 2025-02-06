import * as alt from 'alt-server';
import { useApi } from '@Server/api/index.js';
import { useRebar } from '@Server/index.js';
import { phoneConfig } from '../../shared/config.js';
import { IPhone, IPhoneCore } from '../../shared/interface.js';

const PHONE_COLLECTION = 'PhoneCore';

const Phones: { [key: string]: IPhoneCore } = {};
const Rebar = useRebar();
const db = Rebar.database.useDatabase();
const api = Rebar.useApi();

class InternalFunctions {
    static update(phone: IPhoneCore) {
        Phones[phone._id as string] = phone;
    }
}

/**
 * Generates a random phone number with specified number of digits
 * @param digits The number of digits for the phone number (default: 10)
 * @returns Promise<number> The generated phone number
 */
export async function generatePhoneNumber(): Promise<number> {
    // Calculate the range for the given number of digits
    const min = Math.pow(10, phoneConfig.digits - 1); // Minimum number with 'digits' digits
    const max = Math.pow(10, phoneConfig.digits) - 1; // Maximum number with 'digits' digits

    // Generate random number within the range
    const phoneNumber = Math.floor(min + Math.random() * (max - min + 1));

    return phoneNumber;
}

export async function generateBatteryPercentage(): Promise<number> {
    return Math.floor(Math.random() * 101); // Random battery level between 0 and 100
}

export async function update(_id: string, fieldName: string, partialObject: Partial<IPhone>): Promise<any> {
    const Garage = Phones[_id];
    if (!Garage) {
        return { status: false, response: `Phone Data was not found with id: ${_id}` };
    }

    try {
        await db.update({ _id, [fieldName]: partialObject[fieldName] }, PHONE_COLLECTION);
        return { status: true, response: `Updated Phone Data` };
    } catch (err) {
        console.error(err);
        return { status: false, response: `Failed to update phone data.` };
    }
}
