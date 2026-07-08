import type { SubCommand, Context, PrinterService } from "@flowscripter/dynamic-cli-framework/cli-plugin";
import { PRINTER_SERVICE_ID } from "@flowscripter/dynamic-cli-framework/cli-plugin";
import { world } from "@flowscripter/template-bun-rust-library";

const helloRustCommand: SubCommand = {
  name: "hello_rust",
  description: "Greet using a native Rust library via FFI",
  helpTopic: "Hello",
  enableConfiguration: false,
  options: [],
  positionals: [],
  execute: async (context: Context) => {
    const printerService = context.getServiceById(PRINTER_SERVICE_ID) as PrinterService;
    await printerService?.print("Hello ");
    world();
  },
};

export default helloRustCommand;
