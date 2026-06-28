import type { CommandFactory } from "@flowscripter/dynamic-cli-framework/plugin";
import helloCommand from "../command/HelloCommand.ts";

export default class DemoCommandFactory implements CommandFactory {
  getCommands() {
    return [helloCommand];
  }
}
