import { Observable } from 'rxjs';

import GetUserNotificationRequest from 'models/request/user/getUserNotificationRequest';
import TestMailMessageRequest from 'models/request/user/testMailMessageRequest';
import UpdateUserSettingRequest from 'models/request/user/updateUserSettingRequest';

import CommandExecutionResult from 'models/response/commandExecutionResult';
import QueryExecutionResult from 'models/response/queryExecutionResult';

import GetAppInfoResponse from 'models/response/user/getAppInfoResponse';
import GetMailLogsResponse from 'models/response/user/getMailLogsResponse';
import GetNotificationsResponse from 'models/response/user/getNotificationsResponse';
import GetUserSettingsResponse from 'models/response/user/getUserSettingsResponse';

abstract class IUserService {
    abstract getNotifications(request: GetUserNotificationRequest): Observable<QueryExecutionResult<Array<GetNotificationsResponse>>>;

    abstract hideNotification(keys: Array<string>): Observable<CommandExecutionResult>;

    abstract sendTestMailMessage(testMailMessage: TestMailMessageRequest): Observable<CommandExecutionResult>;

    abstract getUserSettings(): Observable<QueryExecutionResult<Array<GetUserSettingsResponse>>>;

    abstract updateUserSettings(updatedSettings: Array<UpdateUserSettingRequest>): Observable<CommandExecutionResult>;

    abstract onNotificationsHidden(): Observable<Array<string>>;

    abstract getMailLogs(): Observable<QueryExecutionResult<Array<GetMailLogsResponse>>>;

    abstract getAppInfo(): Observable<QueryExecutionResult<GetAppInfoResponse>>;
}

export { IUserService };