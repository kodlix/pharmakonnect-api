import { accountTypes } from "src/account/account.constant";
import { RegisterSeedRO } from "src/account/interfaces/account.interface";

export const Account_Seed: RegisterSeedRO[] = [
    {
        email: "developer@netopng.com",
        password: "!Pass4sure",
        accountType: accountTypes.DEVELOPER,
        isRegComplete: true,
        emailVerified: true
    },
    {
        email: "admin@netopng.com",
        password: "!Pass4sure",
        accountType: accountTypes.ADMIN,
        isRegComplete: true,
        emailVerified: true
    }
]