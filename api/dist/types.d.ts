/// <reference types="express" />
export declare class JwtRequest extends Request {
    user: {
        userId: string;
        email: string;
        name: string;
    };
}
