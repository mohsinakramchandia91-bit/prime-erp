from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uvicorn

# --- DATABASE SETUP ---
DATABASE_URL = "sqlite:///./prime_erp.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ===========================
# 1. DATABASE MODELS
# ===========================

class CustomerDB(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    company = Column(String)
    email = Column(String)
    status = Column(String)
    value = Column(String)

class EmployeeDB(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    department = Column(String)
    salary = Column(String)
    status = Column(String)

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    price = Column(String)
    stock = Column(Integer)
    status = Column(String)

class TransactionDB(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    amount = Column(Integer)
    type = Column(String)
    category = Column(String)

# ===========================
# 2. PYDANTIC MODELS
# ===========================

class CustomerCreate(BaseModel):
    name: str
    company: str
    email: str
    status: str
    value: str

class EmployeeCreate(BaseModel):
    name: str
    role: str
    department: str
    salary: str
    status: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: str
    stock: int
    status: str

class TransactionCreate(BaseModel):
    title: str
    amount: int
    type: str
    category: str

# Create Tables
Base.metadata.create_all(bind=engine)

# ===========================
# 3. APP SETUP
# ===========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===========================
# 4. ROUTES
# ===========================

# --- CRM ---
@app.get("/api/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(CustomerDB).all()

@app.post("/api/customers")
def create_customer(c: CustomerCreate, db: Session = Depends(get_db)):
    db_c = CustomerDB(name=c.name, company=c.company, email=c.email, status=c.status, value=c.value)
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c

# --- HR ---
@app.get("/api/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(EmployeeDB).all()

@app.post("/api/employees")
def create_employee(e: EmployeeCreate, db: Session = Depends(get_db)):
    db_e = EmployeeDB(name=e.name, role=e.role, department=e.department, salary=e.salary, status=e.status)
    db.add(db_e)
    db.commit()
    db.refresh(db_e)
    return db_e

# --- INVENTORY ---
@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(ProductDB).all()

@app.post("/api/products")
def create_product(p: ProductCreate, db: Session = Depends(get_db)):
    db_p = ProductDB(name=p.name, category=p.category, price=p.price, stock=p.stock, status=p.status)
    db.add(db_p)
    db.commit()
    db.refresh(db_p)
    return db_p

# --- FINANCE (NEW) ---
@app.get("/api/finance")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(TransactionDB).all()

@app.post("/api/finance")
def create_transaction(t: TransactionCreate, db: Session = Depends(get_db)):
    db_t = TransactionDB(title=t.title, amount=t.amount, type=t.type, category=t.category)
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t

# --- DASHBOARD ---
# --- DASHBOARD (THE BRAIN) ---
# --- SETTINGS: RESET SYSTEM ---
@app.delete("/api/settings/reset")
def reset_system(db: Session = Depends(get_db)):
    # Sare tables khali karo
    db.query(CustomerDB).delete()
    db.query(EmployeeDB).delete()
    db.query(ProductDB).delete()
    db.query(TransactionDB).delete()
    db.commit()
    return {"message": "System Reset Successful"}
@app.get("/api/home")
def home(db: Session = Depends(get_db)):
    # 1. Customers Ginto
    total_customers = db.query(CustomerDB).count()
    
    # 2. Employees Ginto
    total_employees = db.query(EmployeeDB).count()
    
    # 3. Products Ginto
    total_products = db.query(ProductDB).count()
    
    # 4. Paisa Hisab (Income - Expense)
    transactions = db.query(TransactionDB).all()
    income = sum(t.amount for t in transactions if t.type == "Income")
    expense = sum(t.amount for t in transactions if t.type == "Expense")
    balance = income - expense

    return {
        "customers": total_customers,
        "employees": total_employees,
        "products": total_products,
        "balance": balance
    }
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)