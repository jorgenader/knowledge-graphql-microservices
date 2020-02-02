/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RefreshToken
// ====================================================

export interface RefreshToken_refreshToken {
  __typename: "Refresh";
  token: string | null;
  payload: any | null;
}

export interface RefreshToken {
  refreshToken: RefreshToken_refreshToken | null;
}

export interface RefreshTokenVariables {
  token: string;
}
