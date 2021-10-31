import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;

    let token = null;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      token = (authHeaders as string).split(' ')[1];
    }

    return this.authService.isAuthenticated(token);
  }
}
