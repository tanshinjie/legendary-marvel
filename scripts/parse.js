const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

const results = [];

const heros = [];
const masterminds = [];
const schemes = [];
const freeVillains = [];
const freeHenchmen = [];

// fs.createReadStream(path.resolve(__dirname, "../data/_raw.csv"))
//   .pipe(csv())
//   .on("data", (data) => results.push(data))
//   .on("end", () => {
//     results.forEach((result, idx) => {
//       if (result["Heroes"]) {
//         heros.push({
//           id: idx + 1,
//           name: result["Heroes"],
//         });
//       }
//       if (result["Mastermind"]) {
//         masterminds.push({
//           id: idx + 1,
//           name: result["Mastermind"],
//         });
//         if (result["Scheme"]) {
//           schemes.push({
//             id: idx + 1,
//             name: result["Scheme"],
//           });
//         }
//         if (result["Free Henchman"]) {
//           freeHenchmen.push({
//             id: idx + 1,
//             name: result["Free Henchman"],
//           });
//         }
//         if (result["Free Villains"]) {
//           freeVillains.push({
//             id: idx + 1,
//             name: result["Free Villains"],
//           });
//         }
//       }
//     });
//     fs.writeFileSync(
//       path.resolve(__dirname, "../public/heroes.json"),
//       JSON.stringify(heros)
//     );
//     fs.writeFileSync(
//       path.resolve(__dirname, "../public/masterminds.json"),
//       JSON.stringify(masterminds)
//     );
//     fs.writeFileSync(
//       path.resolve(__dirname, "../public/schemes.json"),
//       JSON.stringify(schemes)
//     );
//     fs.writeFileSync(
//       path.resolve(__dirname, "../public/freeVillains.json"),
//       JSON.stringify(freeVillains)
//     );
//     fs.writeFileSync(
//       path.resolve(__dirname, "../public/freeHenchmen.json"),
//       JSON.stringify(freeHenchmen)
//     );
//   });

// const _mastermind = [];
// const mastermindAlwaysLead = [];
// fs.createReadStream(path.resolve(__dirname, "../data/_mastermind.csv"))
//   .pipe(csv())
//   .on("data", (data) => _mastermind.push(data))
//   .on("end", () => {
//     _mastermind.forEach((result, idx) => {
//       if (result["Mastermind"]) {
//         let mastermind = result["Mastermind"];
//         let alwaysLead = result["Always Lead"];
//         mastermindAlwaysLead.push({
//           id: idx + 1,
//           mastermind,
//           alwaysLead,
//         });
//       }
//       fs.writeFileSync(
//         path.resolve(__dirname, "../public/mastermindAlwaysLead.json"),
//         JSON.stringify(mastermindAlwaysLead)
//       );
//     });
//   });

const _consequences = [];
const consequences = [];
fs.createReadStream(path.resolve(__dirname, "../data/_consequences.csv"))
  .pipe(csv())
  .on("data", (data) => _consequences.push(data))
  .on("end", () => {
    console.log(_consequences);
    _consequences.forEach((result, idx) => {
      if (result["Schemes"]) {
        let scheme = result["Schemes"];
        let consequence = result["Consequences"];
        let effect = result["Effect"];
        consequences.push({
          id: idx + 1,
          scheme,
          consequence,
          effect,
        });
      }
    });
    fs.writeFileSync(
      path.resolve(__dirname, "../public/consequences.json"),
      JSON.stringify(consequences)
    );
  });
