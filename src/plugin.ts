import type { Plugin } from "@flowscripter/dynamic-plugin-framework";
import {
  DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
  DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
} from "@flowscripter/dynamic-cli-framework/plugin";
import DemoCommandFactory from "./factory/DemoCommandFactory.ts";
import DemoServiceProviderFactory from "./factory/DemoServiceProviderFactory.ts";

const plugin: Plugin = {
  extensionDescriptors: [
    {
      extensionPoint: DYNAMIC_CLI_FRAMEWORK_COMMAND_FACTORY_EXTENSION_POINT,
      factory: { create: async () => new DemoCommandFactory() },
    },
    {
      extensionPoint: DYNAMIC_CLI_FRAMEWORK_SERVICE_PROVIDER_FACTORY_EXTENSION_POINT,
      factory: { create: async () => new DemoServiceProviderFactory() },
    },
  ],
};

export default plugin;
