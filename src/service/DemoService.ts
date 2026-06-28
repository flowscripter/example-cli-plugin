export const DEMO_SERVICE_ID = "DEMO_SERVICE";

export default interface DemoService {
  greet(name: string): string;
}
