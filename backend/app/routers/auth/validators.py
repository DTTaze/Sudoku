from pydantic import BaseModel

class GoogleUser(BaseModel):
    sub: int
    email: str
    name: str
    picture: str