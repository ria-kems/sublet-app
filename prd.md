Product Requirements Document: Sublet Marketplace Platform
Executive Summary & Problem Statement
Finding and listing short-term sublets is typically fragmented across chaotic social media groups, classified boards, and informal messaging channels. This fragmentation leads to high search friction, unverified listings, and scattered communication.

This platform provides a streamlined, dedicated web portal that splits user intent cleanly into two primary pathways: searching for an existing sublet or creating a new listing. The system leverages Next.js hosted on Vercel, authenticates users securely via Google OAuth, stores relational listing data inside a serverless Neon PostgreSQL instance, and offloads image assets to Vercel Blob storage.
Target Audience & Personas
The primary audience consists of students, traveling professionals, and digital nomads seeking flexible lease durations ranging from a few weeks to several months.

The Subletter (Lister) requires a fast, painless way to publish lease dates, rental amounts, property details, and photographs without paying high listing fees or dealing with cumbersome property management software.

The Subtenant (Searcher) needs to quickly filter by geographic location, price ceiling, and exact date availability, view transparent property details, and contact the verified lister by the email address returned from Google OAuth.
System Architecture & Technical Stack
The application is structured to minimize operational overhead while remaining within free-tier limits during early adoption.

The frontend and backend framework is Next.js utilizing App Router, Server Actions, and React Server Components. Hosting and automated continuous deployment are handled by Vercel on the Hobby tier. Authentication is implemented using NextAuth.js (Auth.js) with the Google OAuth 2.0 provider and session tokens. Relational data persistence is managed by Neon Serverless PostgreSQL, connected via pooled connection strings through Drizzle or Prisma ORM. Asset and image storage uses Vercel Blob Storage (@vercel/blob) with client-side signed uploads. Maps and address geocoding use Mapbox via react-map-gl; geocoding writes latitude and longitude, and the listing detail page draws a neighborhood-area circle rather than an exact door pin. User interface components and styles are built with Tailwind CSS and Radix UI primitives.
Detailed Functional Specifications
1. Landing Page & Navigation
The root view presents a minimal, distraction-free home interface centered around two primary call-to-action buttons: "Search Sublets" and "List a Sublet". The "Search Sublets" button routes the user directly to the exploration interface (/search) where authentication is not required to browse listings. The "List a Sublet" button directs the user to the listing creation workflow (/create-listing). If an unauthenticated user attempts to access this action, the application automatically initiates the Google OAuth authentication flow and redirects them to the listing form upon completion. The navigation header contains brand identity, a link to active listings, and an authentication state widget displaying either a sign-in button or user profile avatar.
2. Authentication Flow (Google OAuth)
Authentication relies exclusively on Google OAuth to minimize account friction and curb spam. A user initiates login via the standard Google provider flow. Upon callback, the OAuth token validates the user profile against Google's API and persists name, email, and profile photo. That email is the only contact channel on a listing; the prototype does not collect a phone number or provide in-app messaging. Sessions are handled via secure, HTTP-only JWT cookies to maintain statelessness across edge functions. Route handlers and Server Actions verify session ownership before allowing any mutation endpoints.
3. Listing Creation Workflow (/create-listing)
A multi-field form that validates inputs on both the client and server sides. It captures basic details such as the title, full description, property type (Apartment, Studio, House, or Condo), and living configuration (Entire place, Private room, or Shared space). Location inputs include street address, city, state, and postal code; Mapbox geocoding fills latitude and longitude from that address. Financial terms include monthly sublet price, deposit requirements, and utility coverage (Included, Partial, or Tenant pays) with optional notes. Amenity checkboxes cover Wi-Fi, furnished, laundry, parking, A/C, kitchen, and pets allowed. Availability timelines capture exact start and end dates. The media uploader supports multi-file image uploads restricted to web formats (JPEG, PNG, WebP) with client-side compression, storing public URLs returned by Vercel Blob. Submitted listings are saved with status active.
4. Search & Discovery Engine (/search)
A searchable feed combining structured filters with a responsive grid layout. The filter bar allows searchers to filter by city, postal code, overlapping date availability ranges, price bounds, property type, and living configuration. Result cards showcase the primary hero image, title, neighborhood, availability window, monthly rate, and host profile avatar. The individual detail view (/listings/[id]) displays the full image carousel, complete description, amenities, utility coverage, a Mapbox neighborhood-area map, and a mailto link to the verified host's Google email.
Database Architecture (Neon PostgreSQL)
-- Extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Users Table (Compatible with NextAuth)

CREATE TABLE users (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(255),

    email VARCHAR(255) UNIQUE NOT NULL,

    email_verified TIMESTAMP WITH TIME ZONE,

    image TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

-- NextAuth Account Link Table

CREATE TABLE accounts (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type VARCHAR(50) NOT NULL,

    provider VARCHAR(50) NOT NULL,

    provider_account_id VARCHAR(255) NOT NULL,

    refresh_token TEXT,

    access_token TEXT,

    expires_at BIGINT,

    token_type VARCHAR(50),

    scope TEXT,

    id_token TEXT,

    session_state TEXT,

    UNIQUE(provider, provider_account_id)

);

-- Listings Table

CREATE TYPE property_type_enum AS ENUM ('apartment', 'studio', 'house', 'condo');

CREATE TYPE living_config_enum AS ENUM ('entire', 'private', 'shared');

CREATE TYPE utility_coverage_enum AS ENUM ('included', 'partial', 'tenant_pays');

CREATE TYPE listing_status_enum AS ENUM ('draft', 'active', 'rented', 'archived');

CREATE TABLE listings (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    property_type property_type_enum NOT NULL DEFAULT 'apartment',

    living_config living_config_enum NOT NULL DEFAULT 'entire',

    utilities utility_coverage_enum NOT NULL DEFAULT 'tenant_pays',

    utilities_notes TEXT,

    status listing_status_enum NOT NULL DEFAULT 'active',

    price_cents INTEGER NOT NULL,

    deposit_cents INTEGER DEFAULT 0,

    address_street VARCHAR(255),

    city VARCHAR(100) NOT NULL,

    state VARCHAR(50) NOT NULL,

    postal_code VARCHAR(20) NOT NULL,

    latitude DECIMAL(9, 6),

    longitude DECIMAL(9, 6),

    available_start DATE NOT NULL,

    available_end DATE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

-- Listing Media Table (Vercel Blob Integration)

CREATE TABLE listing_images (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

    blob_url TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

-- Amenities (seed: Wi-Fi, Furnished, Laundry, Parking, A/C, Kitchen, Pets allowed)

CREATE TABLE amenities (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(50) UNIQUE NOT NULL

);

CREATE TABLE listing_amenities (

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,

    PRIMARY KEY (listing_id, amenity_id)

);

-- Performance Indexes

CREATE INDEX idx_listings_city ON listings(city);

CREATE INDEX idx_listings_availability ON listings(available_start, available_end);

CREATE INDEX idx_listings_price ON listings(price_cents);

CREATE INDEX idx_listings_property_type ON listings(property_type);

CREATE INDEX idx_listings_living_config ON listings(living_config);

CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);

CREATE INDEX idx_listing_amenities_amenity_id ON listing_amenities(amenity_id);
Entity Relationship Diagram (ERD)
The following diagram models the data entities and relationships within the Sublet Marketplace system. users has many accounts and many listings. listings has many listing_images and many listing_amenities. amenities has many listing_amenities.

+---------------------------+       +---------------------------+       +---------------------------+
|          users            |       |         accounts          |       |         listings          |
+---------------------------+       +---------------------------+       +---------------------------+
| id (PK)           UUID    |<---+  | id (PK)           UUID    |  +---<| id (PK)           UUID    |
| name              VARCHAR |    |  | user_id (FK)      UUID    |--+    | user_id (FK)      UUID    |
| email             VARCHAR |    +--| type              VARCHAR |       | title             VARCHAR |
| email_verified    TIMESTAMP|      | provider          VARCHAR |       | description       TEXT    |
| image             TEXT    |       | provider_account_id VARCHAR|      | property_type     ENUM    |
| created_at        TIMESTAMP|      | refresh_token     TEXT    |       | living_config     ENUM    |
| updated_at        TIMESTAMP|      | access_token      TEXT    |       | utilities         ENUM    |
+---------------------------+       | expires_at        BIGINT  |       | utilities_notes   TEXT    |
                                    | token_type        VARCHAR |       | status            ENUM    |
                                    | scope             TEXT    |       | price_cents       INTEGER |
                                    | id_token          TEXT    |       | deposit_cents     INTEGER |
                                    | session_state     TEXT    |       | address_street    VARCHAR |
                                    +---------------------------+       | city              VARCHAR |
                                                                        | state             VARCHAR |
                                                                        | postal_code       VARCHAR |
                                                                        | latitude          DECIMAL |
                                                                        | longitude         DECIMAL |
                                                                        | available_start   DATE    |
                                                                        | available_end     DATE    |
                                                                        | created_at        TIMESTAMP|
                                                                        | updated_at        TIMESTAMP|
                                                                        +---------------------------+
                                                                                 |              |
                                                                                 |              |
                                         +---------------------------+           |              |
                                         |         amenities         |           |              |
                                         +---------------------------+           |              |
                                         | id (PK)           UUID    |--+        |              |
                                         | name              VARCHAR |  |        |              |
                                         +---------------------------+  |        |              |
                                                                        |        |              |
                                         +---------------------------+  |        |              v
                                         |     listing_amenities     |  |        |  +---------------------------+
                                         +---------------------------+  |        |  |      listing_images       |
                                         | listing_id (FK)   UUID    |--+--------|--+---------------------------+
                                         | amenity_id (FK)   UUID    |<--+        |  | id (PK)           UUID    |
                                         +---------------------------+           +-<| listing_id (FK)   UUID    |
                                                                                   | blob_url          TEXT    |
                                                                                   | display_order     INTEGER |
                                                                                   | created_at        TIMESTAMP|
                                                                                   +---------------------------+

Prototype Scope
This prototype covers the demo path only.

The landing page offers Search Sublets and List a Sublet. /search is available without login and filters by city, postal code, dates, price, property type, and living configuration. /listings/[id] shows photos, description, amenities, utilities, a Mapbox neighborhood area, and a mailto link to the lister's Google email. Google sign-in runs only when opening /create-listing. The create form saves the listing as active and uploads images. About 8 seeded listings populate search before anyone signs in.

The listing_status enum keeps draft, rented, and archived for later work. This prototype only writes active. Edit, delete, in-app chat, and payments are out of scope.
Non-Functional Requirements & Security
Static generation and Server-Side Rendering (SSR) for the home screen and search index ensure First Contentful Paint remains under 1.2 seconds. Server actions enforce strict Zod schema validation to guard against malformed data, malicious script injection, or negative pricing anomalies. Image uploads are authenticated and enforce MIME-type inspection alongside a 4.5 MB per-file size ceiling. Creating a listing requires an authenticated session, and the new row stores that session user as the owner.
Supplemental Reading & Documentation
For technical implementation specifications and architecture blueprints, refer to the following official resources:

NextAuth.js Google Provider Documentation – Detailed setup for OAuth consent screens and callback handling.
Neon Postgres Serverless Documentation – Best practices regarding connection pooling and serverless connection strings.
Vercel Blob Storage Guide – API endpoints, limits, and client upload workflows using @vercel/blob.
Mapbox GL JS and Geocoding API – Map rendering with react-map-gl and address-to-coordinate lookup for neighborhood-area display.

