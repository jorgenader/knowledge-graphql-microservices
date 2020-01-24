from gql_rooms_service.application import create_app

app = create_app(debug=True)

if __name__ == "__main__":
    # init_db()
    app.run()
