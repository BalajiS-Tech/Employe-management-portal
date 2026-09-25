# Employee & Project Management Portal

Angular assessment project built with standalone components, Reactive Forms, HttpClient, REST-style JSON Server APIs, RxJS, route guards, an HTTP interceptor, signals, OnPush change detection, lazy-loaded routes, directives and pipes.

## Requirements

- Node.js 22.22.3+ is recommended for Angular 22.
- npm

## Run

Install dependencies:

```bash
npm install
```

Start the mock REST API in one terminal:

```bash
npx json-server db.json --port 3000
```

Start Angular in another terminal:

```bash
npm start
```

Open `http://localhost:4200`.

### Demo login

Email: `admin@example.com`

Password: `admin123`

## API endpoints

- `GET/POST /employees`
- `GET/PUT/DELETE /employees/:id`
- `GET/POST /projects`
- `GET/PUT/DELETE /projects/:id`
- `GET/POST /tasks`
- `GET/PUT/DELETE /tasks/:id`

## Project structure

```text
src/app/
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── features/
│   ├── auth/login/
│   ├── dashboard/
│   ├── employees/
│   │   ├── employee-list/
│   │   ├── add-employee/
│   │   └── employee-details/
│   ├── projects/
│   │   ├── project-list/
│   │   ├── add-project/
│   │   └── project-details/
│   └── tasks/
│       ├── task-list/
│       ├── add-task/
│       └── task-details/
└── shared/
    ├── components/
    ├── directives/
    ├── layout/
    └── pipes/
```

## Angular concepts demonstrated

- Standalone components and component templates
- Routing with route parameters and lazy `loadComponent`
- Reactive Forms and validation
- Services and dependency injection
- `@Input`, `@Output`, ViewChild and ContentChild patterns
- Built-in control flow plus a custom status directive and pipe
- RxJS `Observable`, `debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, and `takeUntil`
- HTTP interceptor and token header
- Route guard and browser-safe authentication storage
- Signals and computed signals
- `ChangeDetectionStrategy.OnPush`
- Responsive UI, loading/error/empty states and delete confirmation

The application intentionally uses JSON Server rather than a custom Node/Express/MySQL backend, so the project can be run locally without a separate backend implementation.
