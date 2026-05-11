declare module '@capacitor-community/apple-sign-in' {
  export interface AppleSignInResult {
    response: {
      identityToken: string;
      authorizationCode: string;
      user?: {
        email?: string;
        name?: {
          firstName?: string;
          lastName?: string;
        };
      };
    };
  }

  export interface AppleSignInOptions {
    clientId: string;
    redirectURI: string;
    scopes: string;
    state: string;
    nonce: string;
  }

  export interface SignInWithApplePlugin {
    authorize(options: AppleSignInOptions): Promise<AppleSignInResult>;
  }

  export const SignInWithApple: SignInWithApplePlugin;
}