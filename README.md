# Daymark Task Manager
https://task-manager-psi-puce-25.vercel.app/

Daymark is a React and TypeScript task-list application. You can add tasks with a priority and due date, search and filter the list, mark tasks complete, and delete them. Tasks are saved in the browser's local storage.

## Project structure

```text
task-manager/
├── public/
│   ├── index.html           # HTML shell; React mounts into the #root element
│   ├── favicon.ico          # Browser tab icon
│   ├── logo*.png            # App icons
│   ├── manifest.json        # Progressive Web App metadata
│   └── robots.txt           # Search crawler instructions
├── src/
│   ├── App.tsx              # Main task app, state, task logic, and UI
│   ├── App.css              # App layout and component styles
│   ├── index.tsx            # React entry point; renders <App />
│   ├── index.css            # Global styles
│   ├── App.test.tsx         # App tests
│   ├── setupTests.ts        # Test environment setup
│   ├── reportWebVitals.ts   # Web Vitals reporting helper
│   └── react-app-env.d.ts   # Create React App TypeScript declarations
├── package.json             # Dependencies and npm scripts
├── package-lock.json        # Exact dependency versions
├── tsconfig.json            # TypeScript compiler settings
├── .gitignore               # Files Git should ignore
└── README.old.md            # Previous project documentation
```

## How the app works

The app's main implementation is in `src/App.tsx`:

- `App` owns the task list and UI state (current filter, search text, and new-task form values).
- `starterTasks` supplies example tasks when no saved task list exists.
- `today` returns today's date in `YYYY-MM-DD` form for due-date comparisons.
- `Icon` renders the small SVG icons used throughout the interface.
- `addTask` validates the entered title and adds a task with its selected priority and due date.
- `toggleTask` switches a task between complete and incomplete.
- `deleteTask` removes a task from the list.
- `counts` and `visibleTasks` are memoized values used to show filter counts and the filtered, searched list.
- A `useEffect` saves task changes to `window.localStorage`. This is browser-local storage; it does not sync tasks between users or devices.

`src/index.tsx` is the frontend entry point. It creates a React root in the `#root` element from `public/index.html`, then renders `App`.

## Development

Install dependencies and start the Create React App development server:

```sh
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). The development server serves the app and refreshes the page when source files change. `npm run dev` starts the same development server.

Other useful commands:

```sh
npm test       # Run the test runner
npm run build  # Create an optimized production build in build/
```

## Server and production deployment

This repository currently contains a **frontend only**. It does not include a custom Node.js/Express server, backend API, or database. `npm start` runs the Create React App development server; it is not the production server. The task data is stored in each browser's local storage.

For production, build the app and deploy the contents of the generated `build/` directory to a static web host:

```sh
npm run build
```

A Node.js host can also serve those static build files, but a production Node server is not included here. If you add one, configure it to serve files from `build/` and return `build/index.html` for app routes that do not match a static file. There are currently no API routes for tasks.
