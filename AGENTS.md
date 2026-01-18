# LingoListen AI Coding Style Guide

This guide outlines the specific patterns and conventions used in the LingoListen AI codebase.

## 1. Next.js & Client-Side Logic
- **Directive Usage**: Always include `"use client";` at the top of files that utilize hooks (`useState`, `useEffect`), browser APIs (MediaRecorder, Speech), or navigation (`useRouter`, `usePathname`).
- **Data Fetching**: Prefer custom hooks (e.g., `useUserData`) to centralize authentication state and user profile data across the dashboard and settings pages.
- **Route Protection**: Use a `SAFE_PATHS` constant (a `Set<string>`) within data hooks to determine if an unauthorized user should be redirected to `/Login?next=...`.

## 2. Component Patterns
- **Functional Components**: Use `const Component: FC = () => ...` for standard components and `export default function Page()` for Next.js app directory pages.
- **Loading/Error States**: Implement early returns for `isLoading` and `error` states returned by hooks before rendering the main UI logic.
- **Tailwind Layouts**: Use a mobile-first approach with Tailwind. For full-screen layouts, use `h-screen` with negative margins (e.g., `-mt-16`) to account for navigation headers.

## 3. TypeScript & Type Safety
- **Cast and Assert**: Use `as` for strict mapping of string values to specific union types (e.g., `userData.difficulty as DifficultyLevel`).
- **Index Signatures**: Use `Record<K, V>` for mapping dynamic data, such as language ISO codes or difficulty-based UI tips.
- **Global Types**: Define module declarations for non-JS assets (like CSS modules) in a `types/` directory to satisfy the compiler.

## 4. State Management & Hooks
- **Mounted Refs**: In async `useEffect` calls, use a `mounted` ref (`useRef(true)`) to prevent state updates on unmounted components and avoid memory leaks.
- **State Initialization**: When initializing state from potentially undefined hook data, use `useEffect` to sync local state once the data is available.
- **Callback Memoization**: Wrap intensive logic or functions passed to external providers (like PayPal) in `useCallback`.

## 5. Media & AI Integration
- **Audio Handling**:
    - Request high-quality audio using `echoCancellation`, `noiseSuppression`, and `autoGainControl`.
    - Check for browser support of `audio/webm;codecs=opus` before falling back to `audio/mp4`.
    - Use `MediaRecorder.requestData()` before `stop()` to ensure all audio chunks are captured.
- **API Orchestration**:
    - Centralize OpenAI model configuration (e.g., `temperature`, `maxTokens`) based on user-selected difficulty levels.
    - Use `FormData` to append `File` objects for Whisper transcriptions.
    - Append timestamps (`?ts=${Date.now()}`) to API URLs to bypass potential caching on POST requests if required.

## 6. External Integrations
- **PayPal**: Wrap subscription-related UI in `PayPalScriptProvider`. Use `Promise` wrappers inside `onApprove` to handle complex asynchronous validation.
- **Axios**: Prefer `axios` for API interactions, utilizing `withCredentials: true` for session-based auth and `axios.isAxiosError(err)` for type-safe error handling.

## 7. Utilities
- **UUID Generation**: Use `globalThis.crypto?.randomUUID()` as a primary method for generating unique identifiers, with a `Math.random` fallback for legacy environments.