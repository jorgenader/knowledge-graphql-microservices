/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShoppingLists
// ====================================================

export interface ShoppingLists_shoppingLists_edges_node_owner {
  __typename: "User";
  id: string;
  email: string;
}

export interface ShoppingLists_shoppingLists_edges_node {
  __typename: "ShoppingList";
  id: string;
  name: string;
  owner: ShoppingLists_shoppingLists_edges_node_owner | null;
}

export interface ShoppingLists_shoppingLists_edges {
  __typename: "ShoppingListEdge";
  node: ShoppingLists_shoppingLists_edges_node | null;
}

export interface ShoppingLists_shoppingLists {
  __typename: "ShoppingListConnection";
  edges: (ShoppingLists_shoppingLists_edges | null)[];
}

export interface ShoppingLists {
  shoppingLists: ShoppingLists_shoppingLists | null;
}
