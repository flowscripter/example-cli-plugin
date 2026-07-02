export const DEMO_SERVICE_ID = "DEMO_SERVICE";

export default interface DemoService {
  cowsay(name: string): string;
}
