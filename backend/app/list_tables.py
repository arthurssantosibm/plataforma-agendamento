from sqlalchemy import inspect
from app.core.database import engine


inspector = inspect(engine)

tables = inspector.get_table_names()

print("Tabelas no banco:\n")
for table in tables:
    print("-", table)
from app.core.database import engine
from sqlalchemy import text

query = """
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
"""

with engine.connect() as conn:
    result = conn.execute(text(query))

    print("📋 Tabelas no banco:\n")
    for row in result:
        print("-", row.table_name)
