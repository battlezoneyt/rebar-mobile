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
    static update(phone: IPhone) {
        Phones[phone._id as string] = phone;
    }
}

export async function init() {
    try {
        // Fetch all faction data in a single query
        const phoneList = await db.getAll<IPhone>(PHONE_COLLECTION);

        if (!phoneList || phoneList.length === 0) {
            alt.logWarning(`No Phone Data have been created`);
            return;
        }

        // Load all factions into memory
        for (const phone of phoneList) {
            InternalFunctions.update(phone);
        }

        alt.log(`Loaded ${phoneList.length} factions successfully.`);
    } catch (error) {
        alt.logError(`Error initializing factions: ${error.message}`);
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
    const existingPhoneNo = await getPhoneInfoByPhoneNo(phoneNumber);

    if (!existingPhoneNo) {
        return phoneNumber;
    }
    return null;
}

export async function generateBatteryPercentage(): Promise<number> {
    return Math.floor(Math.random() * 101); // Random battery level between 0 and 100
}

export async function update(_id: string, fieldName: string, partialObject: Partial<IPhone>): Promise<any> {
    const phone = Phones[_id];
    if (!phone) {
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

export async function createNewPhone(player: alt.Player, _Phone?: any) {
    const character = Rebar.document.character.useCharacter(player);
    if (!character) return { status: false, response: `Character was not found.` };

    if (character.get().phoneId || character.get().phoneId !== undefined) {
        return { status: false, response: `Character already has a phone.` };
    }

    // Try up to 3 times to generate valid phone number and battery
    for (let attempt = 0; attempt < 3; attempt++) {
        const phonenumber = await generatePhoneNumber();
        const battery = await generateBatteryPercentage();

        if (phonenumber && battery !== null) {
            const phoneData: IPhone = {
                ..._Phone,
                phoneno: phonenumber,
                characterId: character.get()._id,
                battery: battery,
                apps: [],
            };

            const document = await db.create<IPhone>(phoneData, PHONE_COLLECTION);

            if (!document) {
                continue; // Try again if database insertion failed
            }

            const phoneId = document.toString();
            phoneData._id = phoneId;
            InternalFunctions.update(phoneData);
            character.set('phoneId', phoneId);

            return { status: true, response: phoneId };
        }

        console.log(`Attempt ${attempt + 1} failed. Trying again...`);
    }

    // If all attempts failed
    return { status: false, response: `Failed to create phone after 3 attempts.` };
}

export async function getPhoneInfoById(_id: string): Promise<IPhone | null> {
    return Phones[_id] || null;
}

export async function getPhoneInfoByCharacterId(characterId: string): Promise<IPhone | null> {
    const existingPhone = Object.values(Phones).find((phone) => phone.characterId === characterId);
    return existingPhone || null;
}

export async function getPhoneInfoByPhoneNo(phoneno: number): Promise<IPhone | null> {
    // Using Object.values() to get all phone objects
    const existingPhone = Object.values(Phones).find((phone) => phone.phoneno === phoneno);
    return existingPhone || null;
}

init();
