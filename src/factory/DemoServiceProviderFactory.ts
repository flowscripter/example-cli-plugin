import type { ServiceProviderFactory } from "@flowscripter/dynamic-cli-framework/cli-plugin";
import DemoServiceProvider from "../service/DemoServiceProvider.ts";

export default class DemoServiceProviderFactory implements ServiceProviderFactory {
  getServiceProviders() {
    return [new DemoServiceProvider()];
  }
}
