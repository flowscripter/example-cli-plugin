import { describe, expect, test } from "bun:test";
import plugin from "../src/plugin.ts";
import {
  DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
  DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
  PRINTER_SERVICE_ID,
  TABLE_GENERATOR_SERVICE_ID,
} from "@flowscripter/dynamic-cli-framework-api";
import type {
  CommandFactory,
  ServiceProviderFactory,
  CommandRegistry,
  Context,
  CLIConfig,
  SubCommand,
} from "@flowscripter/dynamic-cli-framework-api";
import DefaultDemoService from "../src/service/DefaultDemoService.ts";
import { DEMO_SERVICE_ID } from "../src/service/DemoService.ts";
import type DemoService from "../src/service/DemoService.ts";
import helloCommand from "../src/command/HelloCommand.ts";
import helloRustCommand from "../src/command/HelloRustCommand.ts";
import { WritableStream } from "node:stream/web";
import {
  MultiCommandCliHelpGlobalCommand,
  DefaultPrinterService,
  DefaultTableGeneratorService,
} from "@flowscripter/dynamic-cli-framework";
import type { Terminal, Styler } from "@flowscripter/dynamic-cli-framework";

describe("example-cli-plugin", () => {
  test("plugin has two extension descriptors", () => {
    expect(plugin.extensionDescriptors).toHaveLength(2);
  });

  test("plugin registers COMMAND_FACTORY extension point", () => {
    const ep = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
    );
    expect(ep).toBeDefined();
  });

  test("plugin registers SERVICE_PROVIDER_FACTORY extension point", () => {
    const ep = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
    );
    expect(ep).toBeDefined();
  });

  test("command factory creates hello command", async () => {
    const descriptor = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
    )!;
    const factory = (await descriptor.factory.create()) as CommandFactory;
    const commands = factory.getCommands();
    expect(commands).toHaveLength(2);
    expect(commands[0]!.name).toBe("hello");
    expect(commands[1]!.name).toBe("hello_rust");
  });

  test("service provider factory creates DemoServiceProvider", async () => {
    const descriptor = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
    )!;
    const factory = (await descriptor.factory.create()) as ServiceProviderFactory;
    const providers = factory.getServiceProviders();
    expect(providers).toHaveLength(1);
    expect(providers[0]!.serviceId).toBe(DEMO_SERVICE_ID);
  });

  test("DefaultDemoService.cowsay returns greeting", () => {
    const service = new DefaultDemoService();
    expect(service.cowsay("Alice")).toInclude("Hello, Alice!");
  });

  test("helloCommand has helpTopic 'Hello'", async () => {
    const descriptor = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
    )!;
    const factory = (await descriptor.factory.create()) as CommandFactory;
    const commands = factory.getCommands();
    expect((commands[0] as SubCommand).helpTopic).toBe("Hello");
  });

  test("help output contains 'Hello Commands' section with 'hello'", async () => {
    const descriptor = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
    )!;
    const factory = (await descriptor.factory.create()) as CommandFactory;
    const commands = factory.getCommands();

    const chunks: string[] = [];
    const stdoutStream = new WritableStream<Uint8Array>({
      write: (chunk: Uint8Array) => {
        chunks.push(new TextDecoder().decode(chunk));
      },
    });

    const mockTerminal: Terminal = {
      clearLine: async () => {},
      clearUpLines: async () => {},
      hideCursor: async () => {},
      showCursor: async () => {},
      write: async () => {},
      columns: () => 80,
      rows: () => 24,
    };

    const mockStyler: Styler = {
      colorEnabled: false,
      hyperlinksEnabled: false,
      colorText: (text: string) => text,
      backgroundColorText: (text: string) => text,
      italicText: (text: string) => text,
      hyperlink: (text: string) => text,
    };

    const printerService = new DefaultPrinterService(
      stdoutStream,
      stdoutStream,
      false,
      false,
      mockTerminal,
      mockTerminal,
      mockStyler,
    );
    const tableGeneratorService = new DefaultTableGeneratorService();

    const mockRegistry: CommandRegistry = {
      getSubCommands: () => commands as ReadonlyArray<SubCommand>,
      getGroupCommands: () => [],
      getGlobalCommands: () => [],
      getGlobalModifierCommands: () => [],
      getSubCommandByName: () => undefined,
      getGroupCommandByName: () => undefined,
      getGroupCommandAndMemberSubCommandByJoinedName: () => undefined,
      getGlobalCommandByName: () => undefined,
      getGlobalModifierCommandByName: () => undefined,
      getGroupAndMemberCommandsByJoinedName: () => new Map(),
      getGlobalModifierCommandsByNameProvidedByService: () => new Map(),
      getGlobalModifierCommandsByShortAliasProvidedByService: () => new Map(),
      getGlobalModifierCommandsByNameNotProvidedByService: () => new Map(),
      getGlobalModifierCommandsByShortAliasNotProvidedByService: () => new Map(),
      getNonModifierCommandsByName: () => new Map(),
      getGlobalCommandsByShortAlias: () => new Map(),
    };

    const cliConfig: CLIConfig = { name: "test-cli", version: "0.0.0" };
    const mockContext: Context = {
      cliConfig,
      getServiceById: (id: string): unknown => {
        if (id === PRINTER_SERVICE_ID) return printerService;
        if (id === TABLE_GENERATOR_SERVICE_ID) return tableGeneratorService;
        return undefined;
      },
      doesServiceExist: (id: string): boolean =>
        id === PRINTER_SERVICE_ID || id === TABLE_GENERATOR_SERVICE_ID,
    };

    const help = new MultiCommandCliHelpGlobalCommand(true, mockRegistry);
    await help.execute(mockContext);

    const output = chunks.join("");
    expect(output).toInclude("Hello Commands");
    expect(output).toInclude("hello");
  });

  test("helloCommand.execute prints greeting with trailing newline", async () => {
    const chunks: string[] = [];
    const stdoutStream = new WritableStream<Uint8Array>({
      write: (chunk: Uint8Array) => {
        chunks.push(new TextDecoder().decode(chunk));
      },
    });

    const mockTerminal: Terminal = {
      clearLine: async () => {},
      clearUpLines: async () => {},
      hideCursor: async () => {},
      showCursor: async () => {},
      write: async () => {},
      columns: () => 80,
      rows: () => 24,
    };

    const mockStyler: Styler = {
      colorEnabled: false,
      hyperlinksEnabled: false,
      colorText: (text: string) => text,
      backgroundColorText: (text: string) => text,
      italicText: (text: string) => text,
      hyperlink: (text: string) => text,
    };

    const printerService = new DefaultPrinterService(
      stdoutStream,
      stdoutStream,
      false,
      false,
      mockTerminal,
      mockTerminal,
      mockStyler,
    );

    const demoService: DemoService = {
      cowsay: (name: string) => `Hello, ${name}!`,
    };

    const cliConfig: CLIConfig = { name: "test-cli", version: "0.0.0" };
    const mockContext: Context = {
      cliConfig,
      getServiceById: (id: string): unknown => {
        if (id === PRINTER_SERVICE_ID) return printerService;
        if (id === DEMO_SERVICE_ID) return demoService;
        return undefined;
      },
      doesServiceExist: (id: string): boolean =>
        id === PRINTER_SERVICE_ID || id === DEMO_SERVICE_ID,
    };

    await helloCommand.execute!(mockContext, { name: "Alice" });

    const output = chunks.join("");
    expect(output).toBe("Hello, Alice!\n");
  });

  test("helloRustCommand.execute prints 'Hello ' via printer service", async () => {
    const chunks: string[] = [];
    const stdoutStream = new WritableStream<Uint8Array>({
      write: (chunk: Uint8Array) => {
        chunks.push(new TextDecoder().decode(chunk));
      },
    });

    const mockTerminal: Terminal = {
      clearLine: async () => {},
      clearUpLines: async () => {},
      hideCursor: async () => {},
      showCursor: async () => {},
      write: async () => {},
      columns: () => 80,
      rows: () => 24,
    };

    const mockStyler: Styler = {
      colorEnabled: false,
      hyperlinksEnabled: false,
      colorText: (text: string) => text,
      backgroundColorText: (text: string) => text,
      italicText: (text: string) => text,
      hyperlink: (text: string) => text,
    };

    const printerService = new DefaultPrinterService(
      stdoutStream,
      stdoutStream,
      false,
      false,
      mockTerminal,
      mockTerminal,
      mockStyler,
    );

    const cliConfig: CLIConfig = { name: "test-cli", version: "0.0.0" };
    const mockContext: Context = {
      cliConfig,
      getServiceById: (id: string): unknown => {
        if (id === PRINTER_SERVICE_ID) return printerService;
        return undefined;
      },
      doesServiceExist: (id: string): boolean => id === PRINTER_SERVICE_ID,
    };

    await helloRustCommand.execute!(mockContext, {});

    const output = chunks.join("");
    expect(output).toBe("Hello ");
  });
});
