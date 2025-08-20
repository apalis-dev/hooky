# hooky

**hooky** is a lightweight webhook dispatch service built with **Rust** and **Remix**.  
It provides a fast, reliable backend for receiving and dispatching webhooks, and a modern web frontend for managing endpoints and events.

---

## 🚀 Features
- **Rust backend** – high-performance and reliable webhook handling.
- **Remix frontend** – user-friendly dashboard for managing webhooks and deliveries.
- **Webhook dispatching** – receive, queue, and deliver events to configured targets.
- **Extensible design** – easily add custom logic for authentication, retries, and filtering.

---

## 🛠 Tech Stack
- **Backend:** Rust (`axum`, `tokio`, `serde`, etc.)
- **Frontend:** Remix (React, TypeScript)
- **Database:** (Optional) PostgreSQL or SQLite for storing webhook configurations and delivery logs.
- **Message handling:** Async dispatch with retries.

---

## 📦 Getting Started

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/) or npm/yarn

### Clone the repo
```bash
git clone https://github.com/yourusername/hooky.git
cd hooky
```

### Backend Setup
```bash
cd backend
cargo run
```
This will start the webhook server on `http://localhost:3000`.

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```
This will start the Remix dev server on `http://localhost:5173`.

---

## 📖 Usage
1. Register webhook targets in the dashboard.
2. Send events to `POST /hooks/:id`.
3. Monitor delivery attempts and retry failed requests from the UI.

---

## 📚 Roadmap
- [ ] Authentication & API keys  
- [ ] Delivery retries with backoff  
- [ ] Event filtering and transformation  
- [ ] Multi-tenant support  

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or PR.

---

## 📜 License
MIT
