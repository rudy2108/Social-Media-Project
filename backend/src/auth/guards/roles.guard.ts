import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private roles: string[]) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        return this.roles.includes(user.role);
    }
}

@Injectable()
export class AdminGuard extends RolesGuard {
    constructor() {
        super(['ADMIN']);
    }
}

@Injectable()
export class UserGuard extends RolesGuard {
    constructor() {
        super(['USER', 'ADMIN']);
    }
}
