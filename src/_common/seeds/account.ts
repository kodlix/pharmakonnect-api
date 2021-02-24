import { RegisterSeedRO } from "src/account/interfaces/account.interface";

export const Account_Seed: RegisterSeedRO[] = [
    {
        email: "developer@netopng.com",
        password: "!Pass4sure",
        accountType: "Developer",
        isRegComplete: true
    },
    {
        email: "admin@netopng.com",
        password: "!Pass4sure",
        accountType: "Admin",
        isRegComplete: true
    }
]