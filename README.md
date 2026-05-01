# Team Task Manager

A full-stack project management and task assignment application.

## 🚀 Live Demo
* **Frontend Application:** [Insert Live Frontend URL]
* **Backend API:** [Insert Railway Backend URL]
* **Demo Video:** [Insert YouTube/Drive Link]

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted on Railway), Prisma ORM
* **Authentication:** JSON Web Tokens (JWT), bcrypt

## ✨ Features
* **Role-Based Access:** Admin and standard user roles.
* **Project Management:** Admins can create and manage team projects.
* **Task Delegation:** Assign tasks to specific projects with due dates.
* **Status Tracking:** Users can update task progress (Pending, In Progress, Completed).

## 💻 Local Setup
1. Clone the repository.
2. Run `npm install` in both the `/frontend` and `/backend` directories.
3. Create a `.env` file in the `/backend` with your `DATABASE_URL` and `JWT_SECRET`.
4. Run `npx prisma db push` to generate the database schema.
5. Run `npm run dev` in both folders to start the local servers.