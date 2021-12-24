//Super
// const superMonkz = [
//     { name: 'background', number: 13 },
//     { name: 'weapons', number: 8 },
//     { name: 'supermonks', number: 15 },
// ];

// //Asian
// const asianMonkz = [
//     // { name: 'background', number: 13 },
//     // { name: 'weapons', number: 8 },
//     { name: 'skins/asian', number: 1 },
//     { name: 'mouths/asian', number: 3 },
//     // { name: 'eyes/asian', number: 5 },
//     // { name: 'accessories', number: 3 },
//     // { name: 'jewelry', number: 3 },
// ];

// //Black
// const blackMonkz = [
//     // { name: 'background', number: 13 },
//     // { name: 'weapons', number: 8 },
//     // { name: 'skins/black', number: 1 },
//     // { name: 'mouths/black', number: 3 },
//     // { name: 'eyes/bw', number: 5 },
//     // { name: 'accessories', number: 3 },
//     // { name: 'jewelry', number: 3 },
// ];

// //White
// const whiteMonkz = [
//     // { name: 'background', number: 13 },
//     // { name: 'weapons', number: 8 },
//     // { name: 'skins/white', number: 1 },
//     // { name: 'mouths/white', number: 3 },
//     // { name: 'eyes/bw', number: 5 },
//     // { name: 'accessories', number: 3 },
//     // { name: 'jewelry', number: 3 },
// ];

// //TiDye
// const tiDyeMonkz = [
//     // { name: 'background', number: 13 },
//     // { name: 'weapons', number: 8 },
//     // { name: 'skins/tidye', number: 1 },
//     // { name: 'mouths/tidye', number: 3 },
//     // { name: 'eyes/bw', number: 5 },
//     // { name: 'accessories', number: 3 },
//     // { name: 'jewelry', number: 3 },
// ];

// RENDER SKINS FIRST
const renderedSkins = [
    { name: '_renderedSkins', number: 1 },
    { name: '_renderedMouths', number: 5 },
];

// FINAL
const cryptoMonkz = [
    // { name: 'background', number: 24 },
    { name: 'weapons', number: 8 },
    { name: 'skins', number: 23 },
    { name: 'accessories', number: 11 },
    { name: 'eyes', number: 15 },
    { name: 'clothing', number: 4 },
    // { name: 'jewelry', number: 4 },
    // { name: 'mouths', number: 12 },
];

const format = {
    width: 920,
    height: 920
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
    { key: "_hr", val: "hyper rare" },
];

const edititions = [
    // { series:'renderedSkins', config: renderedSkins, number: 10 },
    { series:'cryptoMonkz', config: cryptoMonkz, number: 50 },
    // { series:'superMonkz', config: superMonkz, number: 100 },
    // { series:'asianMonkz', config: asianMonkz, number: 30 },
    // { series:'blackMonkz', config: blackMonkz, number: 15 },
    // { series:'whiteMonkz', config: whiteMonkz, number: 15 },
    // { series:'tiDyeMonkz', config: tiDyeMonkz, number: 30 }
    // { series:'tiDyeMonkz', config: tiDyeMonkz, number: 30 }
]

const currentEdition = edititions[0];

const series = currentEdition.series;
const layersOrder = currentEdition.config
const defaultEdition = currentEdition.number;

module.exports = { layersOrder, format, rarity, defaultEdition, series };