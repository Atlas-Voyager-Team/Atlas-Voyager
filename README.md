# Atlas Voyager

## Overview

**Atlas Voyager** is an interactive web application that brings history to life by displaying a 3D Earth model where users can explore historical events. By selecting a specific year, users can see markers across the globe representing significant events. Clicking on these markers reveals detailed information about each event, sourced from reliable data via the Wikipedia APIs. The project is designed to make learning history engaging, intuitive, and visually interactive, leveraging modern web technologies like Angular and NestJS.

## Features
**Atlas Voyager** is a dynamic web application that combines **Angular** and **NestJS** to create an interactive 3D Earth model. Users can select a year and see markers at locations of historical events worldwide. Clicking on these markers reveals details about each event. This early-stage project aims to make learning history engaging and interactive.

### Technologies Used:
- **Angular**: Front-end framework for building the user interface.
- **NestJS**: Back-end framework for handling server-side logic.
- **Wikipedia APIs**: Fetches data for historical events.
- **TypeScript**: Language used for both client and server development.
- **HTML5 & CSS**: For structuring and styling the application.

## Getting Started

To get started with Atlas Voyager, follow these steps:

### Prerequisites

Ensure you have the following installed on your system:
- [Programming language/environment, e.g., Python 3.8+, Node.js, etc.]
- [Database, e.g., MySQL, PostgreSQL, MongoDB, etc.]
- [Other tools, libraries, or dependencies]

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Atlas-Voyager-Team/Atlas-Voyager.git
    cd Atlas-Voyager
    ```

2. Install dependencies for the client:
    ```bash
    cd client
    npm ci
    ```

3. Install dependencies for the server:
    ```bash
    cd ../server
    npm ci
    ```

### Running the Project

To start the application, you will need to run both the client and server:

1. Start the server:
    ```bash
    cd server
    npm start
    ```

2. Start the client:
    ```bash
    cd ../client
    npm start
    ```

