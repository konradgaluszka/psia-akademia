from pydantic_settings import BaseSettings

class FacebookOauthSettings(BaseSettings):
    facebook_client_id: str
    facebook_client_secret: str
    facebook_redirect_uri: str

    class Config:
        env_file = ".env.facebook"

facebook_settings = FacebookOauthSettings()
