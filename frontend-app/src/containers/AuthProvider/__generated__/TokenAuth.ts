/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TokenAuth
// ====================================================

export interface TokenAuth_tokenAuth {
  __typename: "ObtainJSONWebToken";
  token: string | null;
}

export interface TokenAuth {
  tokenAuth: TokenAuth_tokenAuth | null;
}

export interface TokenAuthVariables {
  email: string;
  password: string;
}
