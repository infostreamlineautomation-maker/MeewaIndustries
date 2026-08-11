import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

db_url = 'postgresql+psycopg://postgres.mxjqrnawyzrhthuuguuy:Mmindustries%4060906090@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)
session = Session()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
new_hash = pwd_context.hash('admin123')

# Check if admin user exists
admin = session.execute(text('SELECT username FROM admin_users')).first()
if not admin:
    print("No admin user found. Creating one...")
    session.execute(text("INSERT INTO admin_users (username, password_hash) VALUES ('admin', :hash)"), {"hash": new_hash})
    username = "admin"
else:
    print("Found admin user:", admin[0])
    session.execute(text("UPDATE admin_users SET password_hash = :hash WHERE username = :username"), {"hash": new_hash, "username": admin[0]})
    username = admin[0]

session.commit()
print(f"Success! Your username is '{username}' and password is 'admin123'")
