import { PlopTypes } from "@turbo/gen";

export default function (plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator("ts-express", {
    description: "Create a new typescript-express service",
    prompts: [
      { type: "input", name: "SERVICE_NAME", message: "New service name" },
      {
        type: "input",
        name: "DEFAULT_PORT",
        message: "Service's dev port",
        default: "3000", // optional default value
        validate: (value: string) => {
          const port = Number(value);
          if (isNaN(port) || port < 3000 || port > 3999) {
            return "please enter a port number between 3000 and 3999";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "apps/{{SERVICE_NAME}}/",
        templateFiles: "templates/ts-express/**",
        base: "templates/ts-express",
        globOptions: { dot: true },
      },
      {
        type: "add",
        path: "apps/{{SERVICE_NAME}}/.env",
        templateFile: "templates/ts-express/.env.template",
      },
      {
        type: "add",
        path: "apps/{{SERVICE_NAME}}/.tsconfig.json",
        templateFile: "templates/ts-express/.tsconfig.template.json",
      },
    ],
  });
}
