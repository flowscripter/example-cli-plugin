import type {
  SubCommand,
  Context,
  ArgumentValues,
} from "@flowscripter/dynamic-cli-framework/plugin";
import { ArgumentValueTypeName } from "@flowscripter/dynamic-cli-framework/plugin";
import { DEMO_SERVICE_ID } from "../service/DemoService.ts";
import type DemoService from "../service/DemoService.ts";

const helloCommand: SubCommand = {
  name: "hello",
  description: "Greet someone using the demo service",
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
    const demoService = context.getServiceById(DEMO_SERVICE_ID) as DemoService | undefined;
    const name = (argumentValues["name"] as string | undefined) ?? "World";
    const greeting = demoService ? demoService.greet(name) : `Hello, ${name}!`;
    console.log(greeting);
  },
};

export default helloCommand;
