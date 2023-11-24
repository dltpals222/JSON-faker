import { JSONSchemaFaker } from "json-schema-faker";
import fs from "fs/promises";
import {JSDOM} from "jsdom"

// 가상의 DOM 환경을 생성합니다.
const dom = new JSDOM(``, { url: "http://localhost" });

// 가상의 DOM 환경에서 global 객체를 가져옵니다.
global.window = dom.window;
global.document = dom.window.document;
global.navigator = { userAgent: 'node.js' };
global.location = dom.window.location;



function deleteFieldsWithRef(obj, ref) {
  for(let key in obj) {
      if(typeof obj[key] === 'object' && obj[key] !== null) {
          deleteFieldsWithRef(obj[key], ref);
      } else if(key === '$ref' && obj[key] === ref) {
          delete obj[key];
      }
  }
}

const rootPath = "JSON/";

const JSONfileName = "ClearChargingProfileRequest";


const path = rootPath + JSONfileName + ".json";
const fileReader = await fs.readFile(path,'utf8');
const schema = JSON.parse(fileReader);
const count = 10;

let ignoreProp = ["customData"];

ignoreProp.forEach(e => {
  if(e === "customData"){
    if(schema.definitions.CustomDataType && Object.keys(schema.definitions.CustomDataType).length >0) delete schema.definitions.CustomDataType
    deleteFieldsWithRef(schema, '#/definitions/CustomDataType')
    delete schema.properties[e];
  }
})

// console.log(schema);

for(let i = 0; i < count; i++) {
JSONSchemaFaker.resolve(schema).then(res => {
    console.log(`${i}번째`,res);
  })
}


