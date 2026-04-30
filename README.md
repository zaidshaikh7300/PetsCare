# Pet Care Management System

# Tech Stack

## Frontend
- React.js
- Vite
- Bootstrap
- Axios
- React Router DOM
- Chart.js

## Backend
- Node.js
- Express.js
- JWT Authentication
- Multer
- Nodemailer
- Cron Jobs

## Database
- MySQL


## Features
- Admin & Owner Authentication
- Admin Dashboard
- Owner Dashboard
- JWT Authentication
- Protected Routes

## Pet Management
- Add Pets
- Edit Pets
- Delete Pets
- Upload Pet Images
- Vaccination Tracking


## Admin Features
- View All Users
- View All Pets
- Analytics Dashboard
- Pie Charts & Bar Charts

## Extra Features
- Notifications
- Activity Logs
- Vaccination Reminder System
- Pagination


# Folder Structure
PetCare/
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── server.js
│   └── .env
|
├── database/
│   └── database.sql 
|
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md




## Create .env File
Create a `.env` file

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=petcare

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

MAIL_USER=yourgmail@gmail.com
MAIL_PASS=your_app_password

MAIL_FROM=PetCare App <yourgmail@gmail.com>

JWT_SECRET=your_secret_key


# Database Setup

1. Open MySQL Workbench
2. Create Database
3. Import:

```txt
database.sql
```

## How to Run

### Backend
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm start


# Future Improvements
- Appointment Booking
- Online Payments
- Real-time Notifications
- Dark Mode
- Mobile App

# Author
Zaid Shaikh