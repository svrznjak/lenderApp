export interface IUser {
  _id: string;
  name: string;
  email: string;
  authId: string;
  currency: string;
  language: string;
  subscription: ISubscription;
}

export interface ISubscription {
  revenuecatId: string;
  type: "FREE" | "STANDARD" | "PREMIUM";
}
