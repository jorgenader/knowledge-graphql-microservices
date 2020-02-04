import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
    Card,
    Col,
    Container,
    Row,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';

import {
    ShoppingLists,
    ShoppingLists_shoppingLists_edges_node as ShoppingList,
} from './__generated__/ShoppingLists';
import ShoppingListsQuery from './ShoppingListsQuery.graphql';

const ShoppingListView = () => {
    const { data } = useQuery<ShoppingLists>(ShoppingListsQuery, {
        pollInterval: 5000,
    });

    const shoppingLists = useMemo<ShoppingList[]>(() => {
        if (data && data.shoppingLists && data.shoppingLists) {
            return data.shoppingLists.edges
                .map<ShoppingList | null>(
                    shoppingList => shoppingList && shoppingList.node
                )
                .filter(
                    (
                        shoppingList: ShoppingList | null
                    ): shoppingList is ShoppingList => !!shoppingList
                );
        }
        return [];
    }, [data]);

    const result = shoppingLists.map(shoppingList => (
        <Card body key={shoppingList.id}>
            <strong>{shoppingList.name}</strong>
            <ListGroup>
                {shoppingList.products
                    ? shoppingList.products.map(product =>
                          product ? (
                              <ListGroupItem key={product.id}>
                                  {product.name}
                              </ListGroupItem>
                          ) : null
                      )
                    : null}
            </ListGroup>
        </Card>
    ));

    return (
        <Container>
            <Row>
                <Col>{result}</Col>
            </Row>
        </Container>
    );
};

export default ShoppingListView;
