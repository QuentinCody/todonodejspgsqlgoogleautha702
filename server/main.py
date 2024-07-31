from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from database import get_connection, initialize_database

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    description: str

@app.get("/")
async def root():
    return {"message": "Hello world!"}


@app.get("/test")
async def test():
    return {"message": "This is a test endpoint"}

@app.get("/api/env")
async def get_env():
    env_string = "<br />".join([f"{key} = {value}" for key, value in os.environ.items()])
    return {"message": f"Environment variables are below as follows: <br />{env_string}"}

@app.get("/api/items")
async def get_items():
    conn = await get_connection()
    try:
        items = await conn.fetch('SELECT * FROM TodoItems')
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

@app.post("/api/items")
async def add_item(item: Item):
    conn = await get_connection()
    try:
        result = await conn.fetchrow(
            'INSERT INTO TodoItems (Description) VALUES ($1) RETURNING *',
            item.description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

@app.delete("/api/items/{id}")
async def delete_item(id: int):
    conn = await get_connection()
    try:
        await conn.execute('DELETE FROM TodoItems WHERE id = $1', id)
        return {"message": "Item deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

@app.on_event("startup")
async def startup_event():
    await initialize_database()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
