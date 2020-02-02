def test_token_auth(gql_client, gql_execute, super_user, password):
    login_query = """
    mutation TokenAuth($email: String!, $password: String!) {
      tokenAuth(email: $email, password: $password) {
        token
      }
    }
    """
    viewer = """
    query GetActiveUser {
      viewer {
        email
      }
    }
    """

    status, content = gql_execute(
        login_query,
        op_name="TokenAuth",
        variables={"email": super_user.email, "password": password},
    )

    assert status == 200
    token = content.get("data").get("tokenAuth").get("token")

    gql_client.force_login(super_user)
    status, content = gql_execute(viewer, token=token)

    assert status == 200

    assert "errors" not in content, "Expected to not contain error"
    assert content.get("data").get("viewer").get("email") == super_user.email
