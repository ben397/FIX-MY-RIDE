# Fix-My-Ride Backend API

A comprehensive backend API for the Fix-My-Ride platform built with Node.js, Express, and Supabase.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Features**: Live location tracking, chat, and notifications via Supabase Realtime
- **Geospatial Services**: Mechanic-driver matching based on location
- **Payment Integration**: Stripe integration for secure payments
- **File Storage**: Supabase Storage for user photos and documents
- **Push Notifications**: Firebase Cloud Messaging integration
- **Comprehensive API**: RESTful endpoints for all platform features

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT + Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Notifications**: Firebase Cloud Messaging
- **Geolocation**: Google Maps API
- **Validation**: Zod + Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project
- Stripe account
- Google Maps API key
- Firebase project

### Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend