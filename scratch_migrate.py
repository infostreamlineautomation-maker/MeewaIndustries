from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv('.env')
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')
print('Connecting to:', SQLALCHEMY_DATABASE_URL.split('@')[1] if '@' in SQLALCHEMY_DATABASE_URL else SQLALCHEMY_DATABASE_URL)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
with engine.connect() as conn:
    conn.execute(text('ALTER TABLE products ADD COLUMN IF NOT EXISTS section1_image VARCHAR;'))
    conn.execute(text('ALTER TABLE products ADD COLUMN IF NOT EXISTS section2_image VARCHAR;'))
    conn.commit()
print('Added columns to Supabase successfully')
