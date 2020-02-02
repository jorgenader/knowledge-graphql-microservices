/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyToken
// ====================================================

export interface VerifyToken_verifyToken {
  __typename: "Verify";
  payload: any | null;
}

export interface VerifyToken {
  verifyToken: VerifyToken_verifyToken | null;
}

export interface VerifyTokenVariables {
  token: string;
}
