import { User } from "./user.types";

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    token: string;
    user: User;
    success?: boolean;
    message?: string;
}
