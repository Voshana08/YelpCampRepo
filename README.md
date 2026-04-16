# YelpCamp

A full-stack web application for discovering, sharing, and reviewing campgrounds. Users can create an account, list campgrounds with photos, and leave star-rated reviews — all with role-based authorization so only the right people can edit or delete content.

---

## Live Features

- **Browse Campgrounds** — View all listed campgrounds on the home page with images, titles, locations, and pricing.
- **Create & Manage Campgrounds** — Authenticated users can add new campgrounds with image uploads, descriptions, and pricing. Campground authors can edit or delete their own listings.
- **Reviews & Ratings** — Users can leave star-rated reviews on any campground. Authors can delete their own reviews.
- **User Authentication** — Secure registration and login powered by Passport.js. Sessions persist across requests with automatic redirect-back after login.
- **Authorization** — Middleware guards ensure only the campground or review author can modify or delete their content.
- **Flash Notifications** — Real-time success and error messages for all key user actions.
- **Server-Side Validation** — All form data is validated with Joi before hitting the database.
- **Image Uploads** — Campground images are uploaded directly to Cloudinary via Multer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web Framework | Express.js |
| Templating | EJS + ejs-mate (layouts) |
| Database | MongoDB (via Mongoose ODM) |
| Authentication | Passport.js + passport-local + passport-local-mongoose |
| Image Storage | Cloudinary + Multer + multer-storage-cloudinary |
| Validation | Joi |
| Session Management | express-session |
| Flash Messages | connect-flash |
| HTTP Method Override | method-override |
| Environment Variables | dotenv |
| Frontend Styling | Bootstrap 5 |

---

## Project Structure

```
YelpCampRepo/
├── app.js                  # App entry point — Express setup, middleware, routes
├── middleware.js           # Custom middleware (auth guards, Joi validation)
├── schmas.js               # Joi validation schemas for campgrounds and reviews
├── cloudinary/
│   └── index.js            # Cloudinary + Multer storage configuration
├── controllers/
│   ├── campgrounds.js      # Campground CRUD logic
│   ├── reviews.js          # Review create/delete logic
│   └── users.js            # Register/login/logout logic
├── models/
│   ├── campground.js       # Mongoose Campground schema + cascade delete middleware
│   ├── review.js           # Mongoose Review schema
│   └── user.js             # Mongoose User schema (with passport-local-mongoose plugin)
├── routes/
│   ├── campgrounds.js      # Campground routes
│   ├── reviews.js          # Review routes
│   └── users.js            # Auth routes
├── views/
│   ├── campgrounds/        # Index, show, new, edit pages
│   ├── users/              # Login and register pages
│   ├── partials/           # Navbar, footer, flash messages
│   └── layout/             # Base EJS layout (ejs-mate boilerplate)
├── public/
│   ├── stylesheets/        # Custom CSS
│   └── javascripts/        # Client-side scripts
├── utils/
│   ├── catchAsync.js       # Async error wrapper
│   └── expressError.js     # Custom error class
└── seeds/                  # Database seeding scripts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) running locally (default: `mongodb://127.0.0.1:27017`)
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/Voshana08/YelpCampRepo.git
cd YelpCampRepo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

You can find these values in your Cloudinary dashboard under **Settings > API Keys**.

### 4. (Optional) Seed the database

If you want to pre-populate the database with sample campgrounds:

```bash
node seeds/index.js
```

### 5. Run the application

```bash
node app.js
```

The app will be available at **http://localhost:3000**

---

## Key Implementation Details

### Authentication & Authorization
User authentication is handled end-to-end by Passport.js using the `passport-local` strategy. The `passport-local-mongoose` plugin is added directly to the Mongoose User schema, which provides hashed password storage, `authenticate()`, `serializeUser()`, and `deserializeUser()` methods out of the box. Authorization middleware (`isAuthor`, `isReviewAuthor`) verifies ownership before any edit or delete operation.

### Image Uploads
Images are streamed directly to Cloudinary using Multer as the multipart form handler and `multer-storage-cloudinary` as the storage engine. File references (URL and filename) are stored in MongoDB for display and deletion.

### Cascade Deletion
A Mongoose post-middleware hook on the `Campground` schema automatically deletes all associated reviews whenever a campground is deleted, keeping the database clean without any manual cleanup.

### Error Handling
All async route handlers are wrapped with a `catchAsync` utility that forwards errors to Express's global error handler, which renders a custom error page with the appropriate status code and message.

### Validation
Joi schemas validate all incoming request bodies on the server before any database interaction, providing a layer of protection against malformed or malicious data independent of the client-side checks.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_KEY` | Your Cloudinary API key |
| `CLOUDINARY_SECRET` | Your Cloudinary API secret |

> In production, set `NODE_ENV=production` so the `.env` file is not loaded and environment variables are sourced from the hosting platform instead.
