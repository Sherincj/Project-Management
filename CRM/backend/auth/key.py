import secrets

def generate_secret_key() -> str:
    """Generate a secure random secret key."""
    return secrets.token_urlsafe(32)

if __name__ == "__main__":
    print(generate_secret_key())
