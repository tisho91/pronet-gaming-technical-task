# Pronet Gaming Technical Task
## Overview

This repository contains a technical task implementation for Pronet Gaming.  
It is a monorepo managed with **pnpm**, containing:

- **client** – Angular frontend
- **server** – Node/TypeScript backend
- **shared** – shared libraries and types

The project uses:

- Angular 20+
- NgRx for state management
- Material UI components
- RxJS signals and effects
- Jest for unit testing


---

## Requirements

- Node.js 22.x
- pnpm 10.x

---

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd pronet-gaming-technical-task
```
2. Enable corepack (if not already enabled):
```bash 
corepack enable
pnpm install
```
## Development
Start the project in development mode (client + server concurrently):
```bash
pnpm dev
```
Start the server only in watch mode:
```bash
pnpm dev:server
```

Start the client only in watch mode:
```bash
pnpm dev:client
```

### Production Development
Build the shared and client packages and start the server:
```bash
pnpm serve:prod
// Note: This uses the built client in the pipeline.
```

## Testing

Client
```bash
pnpm test:client
```

Server
```bash
pnpm test:server
```

Run all tests
Client
```bash
pnpm test
```

### Project Structure
```
pronet-gaming-technical-task/
├─ client/          # Angular frontend
├─ server/          # Node/TS backend
├─ shared/          # Shared types
├─ package.json     # Root package
└─ pnpm-workspace.yaml
```

### Scripts
| Script             | Description                                         |
| ------------------ | --------------------------------------------------- |
| `pnpm dev`         | Build shared + start client and server concurrently |
| `pnpm dev:client`  | Start Angular client only                           |
| `pnpm dev:server`  | Start Node server only                              |
| `pnpm dev:prod`    | Build shared + client then start server             |
| `pnpm test`        | Run all tests (client + server)                     |
| `pnpm test:client` | Run only client tests                               |
| `pnpm test:server` | Run only server tests                               | 


### Notes
* The project uses RxJS signals for reactive state in Angular 20+.
* Server Unit tests are written using Jest.
* Make sure to run pnpm install before starting development.
* Recommended Node.js version: 22.x, pnpm version: 10.x.

### Areas for improvement
* End-to-end tests are not implemented
* Some performance optimizations in character list rendering
* Linting setup
* Directories structure in the client
* Not strict file naming convention is followed
* UI could be better
