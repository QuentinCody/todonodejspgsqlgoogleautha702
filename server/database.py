import asyncpg
from os import getenv

from dotenv import load_dotenv

load_dotenv()

async def get_connection():
    return await asyncpg.connect(getenv('POSTGRES_URL'))

async def initialize_database():
    conn=await get_connection()
    try:
        await conn.execute('''
                           CREATE TABLE IF NOT EXISTS TodoItems(
                id SERIAL PRIMARY KEY,
                description TEXT NOT NULL
            )
        ''')
    finally:
        await conn.close()