The persistent Vite development server has been retired. Deploying statically and serving with Nginx is now the default path.

# Workflow

1.  **Deployment**: Build and deploy changes to the local Nginx directory (`/var/www/html/website/`) by running:

    ``` bash
    just deploy
    ```

    This automatically compiles the Markdown sources, builds Vite production assets, and synchronizes them.

2.  **Testing**: Run E2E tests against the static Nginx deployment:

    ``` bash
    just test-staging
    ```

3.  **Ephemeral Preview Server**: Ephemeral servers are spun up dynamically by automated test suites strictly for testing purposes.
