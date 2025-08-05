---
description: How to extract useful debug information from the plugin.
---

# Logging

Sometimes it might be useful to check the system logs and messages from the plugin, especially if you want to check what headers and cookies are being sent.&#x20;

All messages will be written in the same manner as regular `console.log` messages and can be checked in the browser (for CSR) or in the Node console (for SSR).

By default, the plugin uses `3` as logging level and shows error and informational logs without debugging details. You can override `sanctum.logLevel` parameter in the `nuxt.config.ts` and set one of these levels:

* 0 - Fatal and Error&#x20;
* 1 - Warnings
* 2 - Normal logs
* 3 - Informational logs
* 4 - Debug logs
* 5 - Trace logs

It follows the convention of the Consola project, more details can be found here - [Log Level](https://github.com/unjs/consola?tab=readme-ov-file#log-level).
