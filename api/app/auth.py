from datetime import timedelta, datetime
from typing import Union, Optional

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.utils import get_authorization_scheme_param
from jwt import PyJWTError
from passlib.context import CryptContext
from starlette import status
from starlette.requests import Request

from queries import get_user
from schemas import User
from settings import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM, \
    SERVICE_TOKEN

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class OAuth2PasswordCookieOrBearer(OAuth2PasswordBearer):
    def __init__(self, token_url: str, scheme_name: str = None,
                 scopes: dict = None, auto_error: bool = True):
        super().__init__(token_url, scheme_name, scopes, auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.headers.get('Authorization')
        if not authorization:
            authorization = request.cookies.get('auth')
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"}
                )
            else:
                return None
        return param


auth_scheme = OAuth2PasswordCookieOrBearer(token_url='/token')


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(*, data: dict,
                        expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(auth_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    if token == SERVICE_TOKEN:
        return User(id=-1, username='service_user', hashed_password='none')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    user = await get_user(username)
    if user is None:
        raise credentials_exception
    return user


async def authenticate_user(username: str, password: str) -> Union[User, bool]:
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
