import Answer from "./Answer";
import { config } from "./config";
import colors from "colors";
import console from "console";
const prompts = require("prompts");
var term = require("terminal-kit").terminal;

(async () => {
  let response = await prompts({
    type: "select",
    name: "question",
    message: "Choisissez une option !",
    choices: [
      { title: "Poser une question à chatGPT ?", value: "question" },
      { title: "Vérifier une probabilité", value: "proba" },
    ],
    initial: 1,
  });

  if (response.question == "question") {
    response = await prompts({
      type: "text",
      name: "question",
      message: "Entrez la question que vous voulez poser à chatGPT ?",
    });

    let answer = new Answer(response.question, config.ApiKey);
    let res = await answer.getRequest();
    console.log(`\n${colors.bgWhite(colors.black("ChatGPT à répondu:"))} ${res}`);
  } else {
    response = await prompts({
      type: "text",
      name: "question",
      message: "Entrez la question que vous voulez poser à chatGPT ?",
    });

    let choix = await prompts({
      type: "select",
      name: "question",
      message: "Choisissez L'intensité",
      choices: [
        { title: "Très haute (10 minutes max)", value: "10" },
        { title: "Haute (5 minutes max)", value: "5" },
        { title: "Moyenne (3 minutes max)", value: "3" },
        { title: "Basse (30 secondes max)", value: "1" },
      ],
      initial: 1,
    });

    let compare = await prompts({
      type: "text",
      name: "question",
      message: "Entrez le texte que vous voulez comparer ?",
    });

    let answer = new Answer(response.question, config.ApiKey, compare.question);
    await term.spinner("impulse");
    console.log(" Chargement... ");
    let arr = await answer.getMultipleRequests(parseInt(choix.question));
    let proba = await answer.compareTexte(arr, compare.question);
    if (proba >= 75)
      console.log(
        colors.red(
          `Il est très probable que chatGPT ai généré ce texte, à ${proba}% !`
        )
      );
    else if (proba >= 50)
      console.log(
        colors.yellow(
          `Il est probable que chatGPT ai généré ce texte, à ${proba}% !`
        )
      );
    else
      console.log(
        colors.green(
          `Il est peu probable que chatGPT ai généré ce texte, à ${proba}% !`
        )
      );
  }
  process.exit(1);
})();
