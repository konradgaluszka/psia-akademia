import os
from pydantic import BaseSettings

class FacebookOauthSettings(BaseSettings):
    facebook_client_id: str
    facebook_client_secret: str
    facebook_redirect_uri: str

    class Config:
        env_file = ".env"

facebook_settings = FacebookOauthSettings()