import "express-session";

declare module "express-session" {
  interface SessionData {
    admin?: any; // Replace 'any' with your admin type if you have one
    employees?: any; // Replace 'any' with your user type if you have one
  }
}
