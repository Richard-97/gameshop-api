export interface IUser {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    country: string;
    postcode: string;
    isAdmin?: boolean;
}