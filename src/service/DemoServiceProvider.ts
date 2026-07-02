import type {
  ServiceProvider,
  ServiceInfo,
  CLIConfig,
  Context,
} from "@flowscripter/dynamic-cli-framework/plugin";
import { DEMO_SERVICE_ID } from "./DemoService.ts";
import DefaultDemoService from "./DefaultDemoService.ts";

export default class DemoServiceProvider implements ServiceProvider {
  readonly serviceId = DEMO_SERVICE_ID;
  readonly servicePriority = 10;

  async getServiceInfo(_cliConfig: CLIConfig): Promise<ServiceInfo> {
    return { service: new DefaultDemoService(), commands: [] };
  }

  async initService(_context: Context): Promise<void> {}
}
