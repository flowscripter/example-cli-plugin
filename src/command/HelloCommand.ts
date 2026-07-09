import type {
  SubCommand,
  Context,
  ArgumentValues,
  PrinterService,
} from "@flowscripter/dynamic-cli-framework-api";
import {
  ArgumentValueTypeName,
  PRINTER_SERVICE_ID,
} from "@flowscripter/dynamic-cli-framework-api";
import { DEMO_SERVICE_ID } from "../service/DemoService.ts";
import type DemoService from "../service/DemoService.ts";

const helloCommand: SubCommand = {
  name: "hello",
  description: "Greet someone using the demo service",
  helpTopic: "Hello",
  enableConfiguration: false,
  options: [],
  positionals: [
    {
      name: "name",
      description: "Name to greet",
      type: ArgumentValueTypeName.STRING,
      isVarargOptional: true,
    },
  ],
  execute: async (context: Context, argumentValues: ArgumentValues) => {
    const demoService = context.getServiceById(DEMO_SERVICE_ID) as DemoService;
    const printerService = context.getServiceById(PRINTER_SERVICE_ID) as PrinterService;
    const name = (argumentValues["name"] as string | undefined) ?? "World";
    const greeting = demoService.cowsay(name);
    await printerService?.print(`${greeting}\n`);
  },
};

export default helloCommand;
