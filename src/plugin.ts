import { createCLIPlugin } from "@flowscripter/dynamic-cli-framework/plugin";
import DemoCommandFactory from "./factory/DemoCommandFactory.ts";
import DemoServiceProviderFactory from "./factory/DemoServiceProviderFactory.ts";

export default createCLIPlugin({
  commandFactory: new DemoCommandFactory(),
  serviceProviderFactory: new DemoServiceProviderFactory(),
});
