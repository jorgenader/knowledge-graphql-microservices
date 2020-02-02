/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Viewer
// ====================================================

export interface Viewer_viewer {
  __typename: "User";
  id: string;
  email: string;
  name: string;
}

export interface Viewer {
  viewer: Viewer_viewer | null;
}
