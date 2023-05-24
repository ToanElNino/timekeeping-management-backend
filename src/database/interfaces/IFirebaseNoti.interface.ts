export interface IFirebaseNotification {
  title: string;
  body: string;
  iconUrl: string | null;
  data: unknown | null;
  topic: string | null;
  token: string | null;
}
