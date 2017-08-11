# AdonisJs docs

This repo contains the docs, as well as the server to run the website. The server uses AdonisJs.

## Setup

Clone this repo and run `npm install` to install the packages.

## Start server

The server can be started using the `adonis` command.

```bash
adonis serve --dev
```

## Compile docs

The docs are compiled using an edge tag at runtime, but we need a menu file to build the sidebar menu. Which is done using an ace command.

```bash
adonis compile:docs --watch

# or

npm run compile:docs
```

## Compile styles

If you are making any changes to Sass, run the sass watcher.

```bash
npm run compile:styles
```


# Outline

Let's start with the documentation outline.

1. Introduction
  - About Adonisjs
  - Upgrading from 3.x

2. Getting started
  - Installation
  - Folder structure
  - Number guessing game
  - Database

3. HTTP Lifecycle
  - Introduction
  - Routing
  - Request
  - Response
  - Cookies
  - Sessions
  - Authentication
  - Views
  - Handling Exceptions
  - Logging

4. Forms & User Data
  - Forms
  - Validation
  - File uploads

5. JSON API
  - Introduction
  - Restful routes
  - Content negotiation
  - Authentication
  - Model serializers

6. Database and Models
  - Introduction
  - Query builder
  - Models
  - Hooks
  - Traits
  - Serializers
  - Migrations
  - Factories and Seeds

7. Testing
