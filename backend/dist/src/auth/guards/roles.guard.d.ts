import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RolesGuard implements CanActivate {
    private roles;
    constructor(roles: string[]);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export declare class AdminGuard extends RolesGuard {
    constructor();
}
export declare class UserGuard extends RolesGuard {
    constructor();
}
