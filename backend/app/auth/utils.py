import secrets

def generate_state() -> str:
    # 32 bytes ~ 43 url-safe chars
    return secrets.token_urlsafe(32)
