import { AuthService } from './auth.service';
import { AuthDto } from './dto';
export declare class AuthController {
    private authservice;
    constructor(authservice: AuthService);
    signup(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
}
