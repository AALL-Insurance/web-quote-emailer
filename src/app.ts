import { Command } from "commander";
import { handleRunCommand } from "./commands.js";

const main = async () => {
  const program = new Command();

  program
    .name("web-quote-emailer")
    .description("CLI to get unsent web quotes for agents and email them")
    .version("0.1.0");

  program
    .command("run")
    .description("execute the web quote emailer process")
    .argument(
      "<type>",
      "type of email to send: abandoned, completed, scheduled-callback",
    )
    .option(
      "--older-than [minutes]",
      "get web quotes older than specified minutes - 30 is the default",
      "30",
    )
    .action(handleRunCommand);

  await program.parseAsync(process.argv);
};
main();
