import time
import logging
import os
import jwt
from dotenv import load_dotenv
from fastapi import Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from starlette.middleware.base import BaseHTTPMiddleware
from http.cookies import SimpleCookie

load_dotenv()  # Load environment variables

class JWTMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, auth_jwt: AuthJWT):
        super().__init__(app)
        self.auth_jwt = auth_jwt
        self.jwt_secret = os.getenv("AUTHJWT_SECRET_KEY")

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Allow OPTIONS requests to pass through (CORS preflight requests)
        if request.method == "OPTIONS":
            return await call_next(request)

        # Define public routes that don't require authentication
        public_routes = ["/login", "/signup", "/refresh"]
        if request.url.path in public_routes:
            return await call_next(request)

        # Retrieve the 'access_token' from cookies
        cookie_header = request.headers.get("Cookie")
        logging.debug(f"Cookie header: {cookie_header}")

        if cookie_header:
            cookies = SimpleCookie(cookie_header)
            access_token = cookies.get("access_token")
            access_token_value = access_token.value if access_token else None
        else:
            access_token_value = None

        logging.debug(f"Extracted access token: {access_token_value}")

        # Check if the token exists and log it
        if not access_token_value:
            logging.warning("Access token is missing.")
            raise HTTPException(status_code=401, detail="Access token is missing.")

        # Set the request context for AuthJWT
        self.auth_jwt._request = request

        try:
            logging.debug("Verifying JWT token...")
            # Verify the token in the cookies
            self.auth_jwt.jwt_required(access_token_value)
            logging.debug("Token verification successful.")

            # Decode the token using PyJWT
            decoded_token = jwt.decode(access_token_value, self.jwt_secret, algorithms=["HS256"])
            logging.info("Decoded token payload: %s", decoded_token)

            # Extract the user's email or subject claim
            user_identifier = decoded_token.get("email", decoded_token.get("sub"))  # Check for 'email' or fallback to 'sub'
            logging.info(f"Access granted to route: {request.url.path} for user: {user_identifier}")

            # Store the user information in the request state
            request.state.user = user_identifier

        except jwt.exceptions.DecodeError as e:
            logging.error(f"Authorization failed for route: {request.url.path} - Invalid token: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token or authorization error.")
        except Exception as e:
            logging.error(f"Authorization failed for route: {request.url.path} - {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token or authorization error.")

        # Proceed to the next middleware or route handler
        response = await call_next(request)

        # Add the processing time to the response headers
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)

        return response