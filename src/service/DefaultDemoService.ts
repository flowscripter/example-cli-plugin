import type DemoService from "./DemoService.ts";

export default class DefaultDemoService implements DemoService {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}
