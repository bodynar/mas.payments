import { Observable } from 'rxjs';

import { AuthenticateRequest } from 'models/request/authenticateRequest';

abstract class IAuthApiBackendService {
    abstract authenticate(authenticateRequest: AuthenticateRequest): Observable<string>;
}

export { IAuthApiBackendService };