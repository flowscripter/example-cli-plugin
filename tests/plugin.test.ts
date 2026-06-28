import { describe, expect, test } from "bun:test";
import plugin from "../src/plugin.ts";
import {
  DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
  DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
} from "@flowscripter/dynamic-cli-framework/plugin";
import type { CommandFactory } from "@flowscripter/dynamic-cli-framework/plugin";
import type { ServiceProviderFactory } from "@flowscripter/dynamic-cli-framework/plugin";
import DefaultDemoService from "../src/service/DefaultDemoService.ts";
import { DEMO_SERVICE_ID } from "../src/service/DemoService.ts";

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
      (d) =>
        d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
    );
    expect(ep).toBeDefined();
  });

  test("command factory creates hello command", async () => {
    const descriptor = plugin.extensionDescriptors.find(
      (d) => d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
    )!;
    const factory = (await descriptor.factory.create()) as CommandFactory;
    const commands = factory.getCommands();
    expect(commands).toHaveLength(1);
    expect(commands[0]!.name).toBe("hello");
  });

  test("service provider factory creates DemoServiceProvider", async () => {
    const descriptor = plugin.extensionDescriptors.find(
      (d) =>
        d.extensionPoint === DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
    )!;
    const factory = (await descriptor.factory.create()) as ServiceProviderFactory;
    const providers = factory.getServiceProviders();
    expect(providers).toHaveLength(1);
    expect(providers[0]!.serviceId).toBe(DEMO_SERVICE_ID);
  });

  test("DefaultDemoService.greet returns greeting", () => {
    const service = new DefaultDemoService();
    expect(service.greet("Alice")).toBe("Hello, Alice!");
  });
});
