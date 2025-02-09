from fastapi import APIRouter

router = APIRouter()

@router.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

@router.post("/items/")
def create_item(item):
    return {"item_name": item.name, "item_age": item.age}