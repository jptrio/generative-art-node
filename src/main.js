const fs = require("fs");
const {
  createCanvas,
  loadImage
} = require("canvas");
const console = require("console");
/* @dev Parse the config file and get all of the corresponding elements needed to create the images and the metadata.json */
const {
  layersOrder,
  format,
  rarity,
  series,
} = require("./config.js");

/* @dev Draw an empty canvas element and set it to be 2 dimensions */
const canvas = createCanvas(format.width, format.height);
let ctx = canvas.getContext("2d");

/* @dev Clear the canvas and redraw it */
const clearCanvas = () => {
  ctx.clearRect(0, 0, format.width, format.height);
}

/* @dev We do not need a .env but if we did, we would set the working directory */
if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

/* @dev Set the directory and the series path for the new directory that will be created along with the metadata.json */
const buildDir = `${process.env.PWD}/${series}`;
/* @dev Set the name of the output metadata.json file */
const metDataFile = '_metadata.json';
/* @dev Set the path for saving files in layers directory */
const layersDir = `${process.env.PWD}/layers`;

/* @dev Metadata is an array */
let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
let rendering = 0;

/* @dev Exists means the image has been created with a unique hash and the meta data is stored here to be later turned into the metadata.json */
const Exists = new Map();

/* @dev This simply puts how rare an itemm is in the metadata.json */
const addRarity = _str => {
  let itemRarity;

  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });

  return itemRarity;
};

/* @dev Remove the rarity from the name of the layer */
const cleanName = _str => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

/* @dev Get the files for each element or layers used in the image creation process */
const getElements = path => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        /* @dev Clean the name an parse the rarity */
        name: cleanName(i),
        fileName: i,
        /* @dev Append the rarity in the metadata.json file */
        rarity: addRarity(i),
      };
    });
};

/* @dev Creates the object for constructing a layer on the image */
const layersSetup = layersOrder => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: {
      x: 0,
      y: 0
    },
    size: {
      width: format.width,
      height: format.height
    },
    number: layerObj.number
  }));
  return layers;
};

/* @dev Creates the directory that is populated with rendered images */
const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, {
      recursive: true
    });
  }
  fs.mkdirSync(buildDir);
};

/* @dev Stores the layer to the .png and writes it to the file */
const saveLayer = async (_canvas, _rendering) => {
  await fs.writeFileSync(`${buildDir}/${_rendering}.png`, _canvas.toBuffer("image/png"));
};

/* @dev */
const addMetadata = _edition => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};

/* @dev */
const addAttributes = (_element, _layer) => {
  let tempAttr = {
    id: _element.id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({
    [_layer.id]: _element.id
  });
};

/* @dev Deaw each layer to the context and save it to the canvas */
const drawLayer = async (_layer, _rendering) => {
  /* @dev Set a random number for us to use for getting items */
  const rand = Math.random();
  
  /* @dev The element is a random layer from the layer number */
  let element = _layer.elements[Math.floor(rand * _layer.number)] ? _layer.elements[Math.floor(rand * _layer.number)] : null;
  
  /* @dev Make sure an element exists else do nothing */
  if (element) {
    addAttributes(element, _layer);

    console.log(`Load Layer Image: ${_layer.location}${element.fileName}`)
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    
    if(rendering != _rendering) {
      clearCanvas();
      rendering ++;
    }
    
    await ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    
    await saveLayer(canvas, _rendering);
  }
};

/* @dev */
const createFiles = async edition => {

  /* @dev */
  const layers = layersSetup(layersOrder);
  
  /* @dev We set the number of duplicates to prevent an infinite loop. 
  The number of retries shuold never exceed the max available */
  let numDupes = 0;

  /* @dev For each monk in each edition */
  for (let i = 1; i <= edition; i++) {
    
    console.log('Created Edition: ', edition)
    
    /* @dev Loop through the layers for each image */
    await layers.forEach(async (layer) => {
      /* @dev Write each layer */
      await drawLayer(layer, i);
    });
    
    /* @dev Create the hash of the characters */
    let key = hash.toString();
    
    /* @dev If the current hash exists in the Exists map then we cannot use this image */
    if (Exists.has(key)) {
      console.log(
        `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
         key
       )}`
      );
      numDupes++;
      if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
      i--;
    } else {
      Exists.set(key, i);
      addMetadata(i);
      console.log("Minted Edition: ", i);
    }
  }
};

const createMetaData = () => {
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if (err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/${metDataFile}`, JSON.stringify(metadata, null, 2));
    } else {
      console.log('Oh no, error: ', err.code);
    }
  });
};

module.exports = {
  buildSetup,
  createFiles,
  createMetaData
};
