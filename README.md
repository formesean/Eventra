# Eventra - Event Management System

A full-stack web application for managing events, built with Next.js (Frontend) and PHP (Backend) with MySQL database.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [XAMPP](https://www.apachefriends.org/) (for PHP and MySQL)
- [Git](https://git-scm.com/) (for version control)

## Installation

### Backend Setup (PHP)

1. Start XAMPP Control Panel and start Apache and MySQL services
2. Navigate to your XAMPP installation directory (typically `C:\xampp` on Windows)
3. Copy the entire `server` folder to the `htdocs` directory
4. The backend API will be accessible at `http://localhost/server/`

### Frontend Setup (Next.js)

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install --force
   ```

3. Contact the developer to obtain the `.env` file for the frontend configuration

## Database Setup

1. Open XAMPP Control Panel and start MySQL
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `eventra`
4. Import the database schema:
   - Locate the `eventra.sql` file in the `server` folder
   - In phpMyAdmin, select the `eventra` database
   - Click on the "Import" tab
   - Click "Choose File" and select the `eventra.sql` file
   - Click "Go" to import the database schema

## Running the Application

1. Ensure XAMPP is running with both Apache and MySQL services started
2. Start the Next.js development server:
   ```bash
   cd client
   npm run dev
   ```
3. Access the application at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
