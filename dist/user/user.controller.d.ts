import { user } from '@prisma/client';
export declare class UserController {
    getMe(User: user): import("@prisma/client/runtime").GetResult<{
        id: number;
        createdAT: Date;
        updatedAT: Date;
        email: string;
        hash: string;
        firstName: string;
        lastName: string;
    }, unknown> & {};
    edituser(): void;
}
