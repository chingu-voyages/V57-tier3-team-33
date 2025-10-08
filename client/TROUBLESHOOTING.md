# Troubleshooting Guide

This guide provides solutions to common issues encountered during the development of this project.

## Error with @rollup/rollup-win32-x64-msvc

When running `npm run dev`, you might encounter an error similar to this:

```
Error: Cannot find module @rollup/rollup-win32-x64-msvc. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

This error is caused by an issue with `npm` and how it handles optional dependencies for `rollup` on Windows.

### Solution

To resolve this issue, follow these steps:

1.  **Update Dependencies:** Run the following command to update all dependencies to their latest compatible versions:

    ```
    npm update
    ```

2.  **Install lottie-react:** Run the following command to ensure the `lottie-react` package is correctly installed:

    ```
    npm i lottie-react
    ```

After following these steps, the development server should start correctly when you run `npm run dev`.
