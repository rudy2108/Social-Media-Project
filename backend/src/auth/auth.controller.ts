import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('admin/login')
    @HttpCode(HttpStatus.OK)
    async adminLogin(@Body() loginDto: LoginDto) {
        return this.authService.adminLogin(loginDto);
    }

    @Post('user/login')
    @HttpCode(HttpStatus.OK)
    async userLogin(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout() {
        // With JWT, logout is handled client-side by removing the token
        return { message: 'Logged out successfully' };
    }
}
