import type { ServiceProviderFactory } from "@flowscripter/dynamic-cli-framework-api";
import DemoServiceProvider from "../service/DemoServiceProvider.ts";

export default class DemoServiceProviderFactory implements ServiceProviderFactory {
  getServiceProviders() {
    return [new DemoServiceProvider()];
  }
}
