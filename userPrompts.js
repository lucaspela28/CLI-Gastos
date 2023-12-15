import inquirer from "inquirer";
import DatePrompt from "inquirer-date-prompt";
inquirer.registerPrompt("date", DatePrompt);

export async function promptNuevoGasto() {
  return await inquirer.prompt(nuevoGastoPrompt);
}

const nuevoGastoPrompt = [
  {
    type: "date",
    name: "fecha",
    message: "Ingrese fecha:",
    locale: "en-US",
    format: { month: "short", hour: undefined, minute: undefined },
  },
  {
    type: "input",
    name: "Especificacion",
    message: "Especifique el gasto:",
  },
  {
    type: "input",
    name: "monto",
    message: "ingrese el monto: $",
  },
];

