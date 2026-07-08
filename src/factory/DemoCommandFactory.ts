import type { CommandFactory } from "@flowscripter/dynamic-cli-framework/cli-plugin";
import helloCommand from "../command/HelloCommand.ts";
import helloRustCommand from "../command/HelloRustCommand.ts";

export default class DemoCommandFactory implements CommandFactory {
  getCommands() {
    return [helloCommand, helloRustCommand];
  }
}
