# Sardex Network Hub

This project is a modern web application for sardex.net, designed to revitalize the platform, streamline user interactions, and facilitate trade within the network.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Core Modules](#core-modules)
- [AI Agentic System Plan](#ai-agentic-system-plan)

# **App Name**: Sardex Network Hub

## Core Features:

- Unified Onboarding: Streamlined onboarding for Enterprises and Consumers with distinct paths and secure data collection.
- QR Code Payments: Secure user accounts with integrated QR code payment generation and scanning for seamless transactions within the Sardex network.
- Enterprise Marketplace: Dedicated marketplace for Enterprises to list goods/services, with browsing and searching capabilities for all users.
- AI Trade Suggestions: AI-powered tool that suggests potential trade partners and opportunities based on user needs and network activity.
- Fiat Top-up: PayPal integration for Enterprises to top up their Sardex balance with fiat currency, utilizing the existing plugin.

## Style Guidelines:

- Primary color: Sardex Green (#32CD32) to reflect the brand's identity.
- Secondary color: Light Gray (#F5F5F5) for backgrounds and neutral elements.
- Accent color: Coral (#FF7F50) for interactive elements and calls to action.
- Clean and modern layout with a focus on readability and ease of navigation.
- Use of simple, geometric icons for key actions and features.
- Subtle transitions and animations to enhance user experience without being distracting.

## Original User Request:
**Objective:** Generate a comprehensive plan and initial codebase structure for a new, modern web application for `sardex.net`. This application aims to revitalize the platform, streamline user interactions, and facilitate trade within the network using advanced features.

**Core Functionality:**

1.  **Unified Onboarding:**
    *   Design and implement a seamless, intuitive onboarding process for two distinct user types:
        *   **Enterprises:** Businesses joining the network.
        *   **Consumers:** Individual users.
    *   The process should be efficient and gather necessary information securely.

2.  **User Accounts & QR Code Payments:**
    *   Provide secure user accounts for both Enterprises and Consumers upon successful onboarding.
    *   Each user account must have integrated payment capabilities.
    *   Implement functionality for users to easily make and receive payments within the Sardex network by generating and scanning QR codes.

3.  **Enterprise Marketplace:**
    *   Develop a dedicated marketplace section within the application.
    *   Registered Enterprises should be able to create listings for goods or services they offer for trade within the network.
    *   Users (Consumers and potentially other Enterprises) should be able to browse, search, and view these listings.

4.  **AI-Powered Trade Facilitation:**
    *   Integrate an AI agentic system designed to actively assist users in finding and executing trades within the Sardex network.
    *   **Capabilities should include:**
        *   Suggesting potential trade partners or opportunities based on user needs, offers, and network activity.
        *   Facilitating communication or negotiation between potential trade partners (optional, depending on complexity desired).
        *   Providing insights into market trends within the Sardex network.

**Technical Specifications & Integrations:**

1.  **Payment Backend:**
    *   The core payment and account balance logic *must* integrate with **Cyclos (cyclos.org)**.
    *   Utilize the provided **Cyclos OpenAPI specification** to interact with the Cyclos backend for transactions, account management, etc.

2.  **Fiat Top-up:**
    *   Integrate with **PayPal** to allow **Enterprises** to top up their Sardex account balance using fiat currency.
    *   Utilize the **existing plugin** that connects to the PayPal API for this specific purpose.

3.  **Technology Stack:**
    *   Propose and use a **modern, robust, and scalable technology stack**. Examples:
        *   Frontend: React, Vue, Angular, or Svelte.
        *   Backend: Node.js (with Express/NestJS), Python (with Django/Flask), Go, or Ruby on Rails.
        *   Database: PostgreSQL, MySQL, or MongoDB (choose appropriately based on data structure needs).
    *   Prioritize technologies known for good performance, security, and developer community support.

4.  **QR Codes:** Implement reliable QR code generation and scanning capabilities (likely client-side for scanning).

**Key Considerations:**

*   **User Experience (UX):** Focus on creating a clean, intuitive, and user-friendly interface for both desktop and mobile web users (Responsive Design).
*   **Security:** Implement industry-standard security practices throughout the application, especially for authentication, data storage, and financial transactions.
*   **Scalability:** Architect the application to handle potential future growth in users and features.
*   **Maintainability:** Produce clean, well-documented, and modular code.

**Output:**

*   Provide a recommended technology stack.
*   Outline the application architecture (e.g., key modules, data flow).
*   Generate the initial project structure and foundational code for the core modules described above, including API integration points for Cyclos and PayPal.
*   Detail the plan for implementing the AI agentic system.


## Technology Stack

**Frontend:**

*   **Next.js (React):** Chosen for its server-side rendering (SSR), excellent performance, SEO benefits, and ease of development.
*   **TypeScript:** For static typing, improved code maintainability, and developer experience.
*   **Tailwind CSS:** For utility-first CSS approach, rapid UI development, and consistency in design.
*   **Radix UI:** For accessible UI components.

**Backend:**

*   **Node.js (with NestJS):** Chosen for its scalability, performance, and TypeScript support. NestJS provides a modular architecture and excellent developer experience.
*   **Prisma:** Chosen as a modern database ORM.

**Database:**

*   **PostgreSQL:** Chosen for its robustness, data integrity, and support for advanced features like JSONB, suitable for complex data structures.

**Other Tools:**

*   **Cyclos API:** For core payment and account balance management.
*   **PayPal API:** For fiat currency top-ups by Enterprises.
*   **OpenAI API:** For AI trade suggestion and marketplace summarization.
*   **Vercel:** For hosting, CI/CD, and performance optimizations.

## Application Architecture

The application follows a modular architecture with clear separation of concerns:

1.  **Frontend (Next.js):**
    *   **Pages:** Routes and layouts.
    *   **Components:** Reusable UI elements.
    *   **Hooks:** Custom React hooks for logic and state management.
    *   **Services:** Client-side data fetching and API interaction.

2.  **Backend (NestJS):**
    *   **Controllers:** Handle incoming requests and responses.
    *   **Services:** Business logic and data operations.
    *   **Modules:** Group related controllers and services.
    *   **Database (Prisma):** ORM to manage data models and interact with PostgreSQL.
  