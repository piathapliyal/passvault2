# Password Vault (MVP)

A secure password manager built using **Next.js**, **TypeScript**, and **MongoDB**.  
Users can sign up, log in, and save encrypted passwords safely.


## Features
- User authentication (signup + login)
- Password encryption and decryption using AES
- Add, edit, delete, and copy credentials
- MongoDB database for secure storage
- Clean and minimal UI


## Tech Stack
- Next.js 15
- React 19
- TypeScript
- MongoDB + Mongoose
- bcryptjs + JWT

## Setup Instructions

1. Clone the repository:

   git clone https://github.com/piathapliyal/passvault2.git


2.Install dependencies:
  npm install
 
3.Create a .env.local file:
  MONGODB_URI="your-mongodb-connection-uri"
  JWT_SECRET="your-secret-key"

4.Run the app:
  npm run dev