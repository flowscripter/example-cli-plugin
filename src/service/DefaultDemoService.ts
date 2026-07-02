import * as cowsay from "cowsay";
import type DemoService from "./DemoService.ts";

export default class DefaultDemoService implements DemoService {
  cowsay(name: string): string {
    return cowsay.say({ text: `Hello, ${name}!` });
  }
}
