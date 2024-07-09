import conf from "../conf/conf.js";

import { Client, Account, ID } from "appwrite";

export class AuthService {
    Client = new Client();
    account;

    constructor() {
        this.Client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.Client);    
    }

    async createAccount({email, password, name}) {
        //to save it from fail, we will add try catch
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                //call another method
                //login - if successfully created
                return this.login({email, password});
            }else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }


    async login ({ email, password}) {
        try {
            await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }   
    
    
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSession();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
} 

const authService = new AuthService();

export default authService;