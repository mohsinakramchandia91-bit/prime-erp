# Prime ERP — Open-Source ERP with CRM, HR, Finance & Inventory

Prime ERP is an open-source ERP system for small and mid-size businesses. It pairs a FastAPI + SQLAlchemy backend with a Next.js frontend, covering CRM, HR, Finance, Inventory, and Settings in one codebase. Data is stored in SQLite.

**Live demo:** https://prime-erp-pi.vercel.app

## How it's built

- `backend/main.py` — FastAPI app with SQLAlchemy models and CRUD endpoints (Customer, Employee) on a SQLite database.
- `frontend/` — Next.js app (TypeScript) with route modules for `crm`, `finance`, `hr`, `inventory`, and `settings` (`frontend/app/...`).

## Run it locally

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Then open the local frontend URL (usually http://localhost:3000) and point it at the backend API.

## Modules

- **CRM** — customer records and management (`frontend/app/crm`)
- **HR** — employee records (`frontend/app/hr`)
- **Finance** — finance views (`frontend/app/finance`)
- **Inventory** — inventory management (`frontend/app/inventory`)
- **Settings** — app settings (`frontend/app/settings`)

## Tech stack

FastAPI · SQLAlchemy · SQLite · Next.js · TypeScript

---

**Built by Muhammad Mohsin — Onyx AI** · [YouTube](https://www.youtube.com/@onyxaipk) · [All products](https://mohsina91.gumroad.com) · [Catalog](https://mohsinakramchandia91-bit.github.io/Catalog/)
