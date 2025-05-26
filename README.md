# Eventra - Event Management System

A RSVP management web application that enables users to create and manage events, track participant responses, and send notifications, all within a clear, responsive interface. Designed with students and small organizations in mind, the platform streamlines event coordination by allowing users to register or log in, publish events, and monitor RSVP statuses in real time.

## Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) – React framework for server-side rendering and routing
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling
- [shadcn/ui](https://ui.shadcn.com/) – Accessible, customizable component library built with Radix UI and Tailwind CSS

**Backend:**
- [PHP](https://www.php.net/) – For lightweight server-side API handling
- [Prisma](https://www.prisma.io/) – ORM for database access in Node.js
- [MySQL](https://www.mysql.com/) – Relational database

**Dev Tools & Infrastructure:**
- [XAMPP](https://www.apachefriends.org/) – Local development server for PHP and MySQL
- [Node.js](https://nodejs.org/) – Runtime for executing JavaScript on the backend
- [Git](https://git-scm.com/) – Version control

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
