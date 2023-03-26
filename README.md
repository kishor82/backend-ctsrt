## Instructions to Run the Project

1.  Run `nvm use` to change the Node version supported by this server.
2.  Run `yarn` to install the project dependencies.
3.  Run `yarn dev` to start the development server.

To access the API documentation, redirect to the `/documentation#` path in your browser.

## Default Users

```json
{
  "users": [
    {
      "name": "user",
      "username": "user_name",
      "email": "user@email.com",
      "role": "USER",
      "password": "user@123"
    },
    {
      "name": "admin",
      "username": "admin_user",
      "email": "admin@email.com",
      "role": "ADMIN",
      "password": "admin@123"
    }
  ]
}
```
