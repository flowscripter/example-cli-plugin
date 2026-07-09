# example-cli-plugin

[![version](https://img.shields.io/github/v/release/flowscripter/example-cli-plugin?sort=semver)](https://github.com/flowscripter/example-cli-plugin/releases)
[![build](https://img.shields.io/github/actions/workflow/status/flowscripter/example-cli-plugin/release-bun-library.yml)](https://github.com/flowscripter/example-cli-plugin/actions/workflows/release-bun-library.yml)
[![coverage](https://codecov.io/gh/flowscripter/example-cli-plugin/branch/main/graph/badge.svg?token=EMFT2938ZF)](https://codecov.io/gh/flowscripter/example-cli-plugin)
[![docs](https://img.shields.io/badge/docs-API-blue)](https://flowscripter.github.io/example-cli-plugin/index.html)
[![license: MIT](https://img.shields.io/github/license/flowscripter/example-cli-plugin)](https://github.com/flowscripter/example-cli-plugin/blob/main/LICENSE)

> Example CLI plugin for the
> [dynamic-cli-framework](https://github.com/flowscripter/dynamic-cli-framework)

This plugin is authored against
[`@flowscripter/dynamic-cli-framework-api`](https://github.com/flowscripter/dynamic-cli-framework-api),
the lightweight plugin-facing API package, rather than the full
`dynamic-cli-framework` - keeping the framework's concrete service
implementations and their dependencies out of the plugin's own
dependency tree.

## Development

Build (produces `dist/` for Node.js and TypeScript consumers; Bun uses raw source directly):

`bun run build`

Test:

`bun test`

Format:

`bunx oxfmt`

Lint:

`bunx oxlint index.ts src/ tests/`

Generate HTML API Documentation:

`bunx typedoc index.ts`

## Documentation

### Overview

```mermaid
classDiagram
    class Plugin {
        <<interface>>
        +extensionDescriptors: ExtensionDescriptor[]
    }

    class DemoCommandFactory {
        <<CommandFactory>>
        +getCommands() SubCommand[]
    }

    class DemoServiceProviderFactory {
        <<ServiceProviderFactory>>
        +getServiceProviders() ServiceProvider[]
    }

    class DemoServiceProvider {
        <<ServiceProvider>>
        +serviceId: string
        +servicePriority: number
        +getServiceInfo(cliConfig) ServiceInfo
        +initService(context) void
    }

    class DemoService {
        <<interface>>
        +greet(name: string) string
    }

    class DefaultDemoService {
        +greet(name: string) string
    }

    class helloCommand {
        <<SubCommand>>
        +name: "hello"
        +positionals: name
        +execute(context, argumentValues) void
    }

    class helloRustCommand {
        <<SubCommand>>
        +name: "hello_rust"
        +execute(context) void
    }

    class world {
        <<@flowscripter/template-bun-rust-library>>
        +world() void
    }

    Plugin --> DemoCommandFactory : extensionDescriptor
    Plugin --> DemoServiceProviderFactory : extensionDescriptor
    DemoCommandFactory --> helloCommand : getCommands()
    DemoCommandFactory --> helloRustCommand : getCommands()
    DemoServiceProviderFactory --> DemoServiceProvider : getServiceProviders()
    DemoServiceProvider --> DefaultDemoService : creates
    DefaultDemoService ..|> DemoService
    helloCommand --> DemoService : uses via context
    helloRustCommand --> world : calls
```

### Framework API

Refer to the
[dynamic-cli-framework](https://github.com/flowscripter/dynamic-cli-framework)
for an overview of what this example is demonstrating.

### API

Link to auto-generated API docs:

[API Documentation](https://flowscripter.github.io/example-cli-plugin/index.html)

## License

MIT © Flowscripter
