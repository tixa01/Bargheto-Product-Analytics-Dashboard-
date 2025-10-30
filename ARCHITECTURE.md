# Architecture & Design Choices

This document explains the high-level architecture of the Product Analytics Dashboard.

## 1. Modular Architecture

The application is structured into three main types of modules:

* **`CoreModule`**: Contains singleton services provided at the root level, such as the `SettingsService` and the `LoggingInterceptor`. It is imported *only* by the `AppModule`.
* **`SharedModule`**: Contains reusable components, pipes, and directives (e.g., `ThemeToggleComponent`). It also exports common Angular Material modules. It is imported by feature modules.
* **Feature Modules**: Contains all logic for a specific business domain.
    * **`ProductsModule`**: This is the main feature module, lazy-loaded on the `/products` route to improve initial load time.

## 2. State Management (Angular Signals)

This project uses **Angular Signals** as the primary state management solution, minimizing the need for third-party libraries.

* **`ProductService`**: This service acts as the "store" for product data.
* **`signal()`**: Holds the raw application state (`ProductState`).
* **`computed()`**: Exposes read-only signals (e.g., `products()`, `loading()`) for components to consume.
* **`toSignal()` / `toObservable()`**: Used as a bridge between the RxJS world (HTTP requests, form value changes) and the Signal world.
* **`effect()`**: Not used for data-flow, but `takeUntilDestroyed()` is used for RxJS-based side-effects (like form listeners) to ensure proper cleanup without manual boilerplate.

## 3. Data Flow & Abstraction

* **Repository Pattern**:
    * `ProductApiService`: Acts as the **Repository**. Its *only* responsibility is to communicate with the `dummyjson.com` API and handle HTTP logic.
    * `ProductService`: Acts as the **Service Layer**. It contains business logic, orchestrates calls to the `ProductApiService`, and manages the application state (signals).

* **Component Design**:
    * **Smart (Container) Components**: `ProductListComponent`, `ProductDetailsComponent`. These components `inject` services, manage data flow, and handle user events.
    * **Dumb (Presentational) Components**: `ProductCardComponent`. These components receive data via `@Input()` and are built with `ChangeDetectionStrategy.OnPush` for maximum performance.

## 4. Performance

* **Lazy Loading**: The `ProductsModule` is lazy-loaded.
* **`OnPush` Change Detection**: All presentational components use `OnPush`.
* **Signals**: Signals provide granular, glitch-free change detection, which is inherently more performant than zone.js-based checking.
* **`trackBy`**: Used in `*ngFor` loops to prevent redundant DOM re-rendering.