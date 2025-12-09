frontend_dir=frontend
backend_dir=backend

.PHONY: install-frontend install-backend dev-frontend dev-backend fmt lint test

install-frontend:
	cd $(frontend_dir) && npm install

install-backend:
	cd $(backend_dir) && pip3 install -r requirements.txt

dev-frontend:
	cd $(frontend_dir) && npm run dev

dev-backend:
	docker compose up -d db pgadmin
	cd $(backend_dir) && python3 -m uvicorn app.main:app --reload --port 8000

fmt:
	cd $(frontend_dir) && npm run format || true
	cd $(backend_dir) && black app || true

lint:
	cd $(frontend_dir) && npm run lint || true

test:
	@echo "Tests not yet implemented; add frontend tests in frontend/app/**/* and backend tests under backend/tests"
