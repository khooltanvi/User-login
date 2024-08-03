# User-login

This API endpoint allows users to log in and obtain a JSON Web Token (JWT) for authentication and authorization. The JWT can be used to access protected routes and resources in the application.

Endpoint
POST /login

Request
URL
https://yourapi.com/api/login

Method
POST

Headers
Content-Type: application/json
Request Body
The request body should be a JSON object with the following fields:

username (string): The username or email of the user.
password (string): The user's password.
Example Request Body:

json
{
  "username": "user@example.com",
  "password": "yourpassword"
}

curl -X POST https://yourapi.com/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "yourpassword"}'
Response
Success Response
HTTP Status Code: 200 OK

Response Body:

json
Copy code
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "expiresIn": 3600
}
token (string): The JWT for authenticated requests.
expiresIn (integer): The time in seconds until the token expires.

Usage
To use the JWT for accessing protected resources:

Include the JWT in the Authorization header of your requests.
Format: Authorization: Bearer <your-jwt-token>.
Example of a protected resource request:

curl -X GET https://yourapi.com/api/protected-resource \
  -H "Authorization: Bearer <your-jwt-token>"

Configuration
JWT Secret: The secret for JWT signing is set in the JWT_SECRET variable.
MongoDB: The application connects to a MongoDB instance at mongodb://127.0.0.1:27017/login.
Notes
Ensure MongoDB is running before starting the application.
Always use HTTPS to protect credentials and tokens during transmission.
Keep your JWTs secure and consider using secure storage mechanisms.

Additional Information
Ensure that you handle JWT expiration and renewal appropriately.
Monitor and log failed login attempts to enhance security.

Contributing
For bug reports or feature requests, please open an issue on this repository. If you would like to contribute, please fork the repository and submit a pull request.
