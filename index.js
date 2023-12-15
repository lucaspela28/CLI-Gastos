import inquirer from "inquirer";
import { get, save } from "./filesMethod.js";
import { promptNuevoGasto} from "./userPrompts.js";

const main = async () => {
  let run = true;

  while (run) {
    const action = await inquirer.prompt([
      {
        type: "list",
        name: "chosen",
        message: "Elija una opción:",
        choices: [
          { value: 1, name: "Ingrese un nuevo gasto:" },
          { value: 2, name: "Cuánto gasté hasta ahora?" },
          { value: 3, name: "Qué pagué hasta ahora?" },
          { value: 4, name: "Suma total por rubro:" },
          { value: 99, name: "SALIR" },
        ],
      },
    ]);

    switch (action.chosen) {
      case 1:
        await nuevoGasto();
        break;
      case 2:
        await cantidadGastada();
        break;
      case 3:
        await pagosRealizados();
        break;
      case 4:
        await totalGastadoItem();
        break;
      case 99:
        run = false;
        break;
      default:
        run = false;
        break;
    }
  }
  console.log("BYE!");
};

main();

async function nuevoGasto() {
  console.log("Nuevo gasto:");
  const nuevoGastoData = await promptNuevoGasto();

  const gastosActuales = await get("gastos");

  gastosActuales.push(nuevoGastoData);

  await save("gastos", gastosActuales);
}

async function cantidadGastada() {
  try {
    const gastosActuales = await get("gastos");

    let sumaMontos = 0;
    for (const gasto of gastosActuales) {
      sumaMontos += parseFloat(gasto.monto); // Convertir a número
    }

    console.log("La suma total de gastos es: $", sumaMontos.toFixed(2)); // Mostrar la suma con 2 decimales
  } catch (err) {
    console.error("Error al cargar los gastos:", err);
  }
}

async function pagosRealizados() {
  const itemPagos = await get("gastos");
  //Recorro "gastos" con un map, y me traigo solo el item "Especificaciones"
  const especificaciones = itemPagos.map((gasto) => gasto["Especificacion"]);
// Filtrar las especificaciones únicas sin duplicados
  const especificacionesUnicas = especificaciones.filter((especificacion, index, self) => {
  return self.indexOf(especificacion) === index;
});

  console.log("Pagaste:", especificacionesUnicas);
}

async function totalGastadoItem() {
  const userInput = await inquirer.prompt([
    {
      type: "input",
      name: "item",
      message: "Ingrese el nombre del rubro:",
    },
  ]);

  const item = userInput.item;

  await sumaTotalItem(item);
}


async function sumaTotalItem(item) {
  try {
    const gastosActuales = await get("gastos");

    let sumaMontos = 0;
    const itemBuscado = item.toLowerCase(); // Convertir a minúsculas
    for (const gasto of gastosActuales) {
      const itemGasto = gasto.Especificacion.toLowerCase(); // Convertir a minúsculas
      if (itemGasto === itemBuscado) {
        sumaMontos += parseFloat(gasto.monto);
      }
    }

    console.log(`La suma total para ${item} es: $${sumaMontos.toFixed(2)}`);
  } catch (err) {
    console.error("Error al cargar los gastos:", err);
  }
}
