const { JSONSchemaFaker } = require("json-schema-faker");

window.onload = function(){
  //id 태그 선언
  const dropZ = document.getElementById("dropZ");
  const resultOutput = document.getElementById("resultOutput");
  const nCount = document.getElementById("nCount");
  const generate = document.getElementById("generate");
  const cData = document.getElementById("c-Data");
  const fakerList = document.getElementById("faker-list");
  
  let schema = '';
  
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  
    var files = evt.dataTransfer.files; // 드롭된 파일 리스트
    var reader = new FileReader(); // FileReader 객체 생성
  
    reader.onload = function(e) {
      schema = JSON.parse(e.target.result); // 파일 내용을 변수에 저장
      resultOutput.innerHTML = '<pre>' + JSON.stringify(schema, null, 2) + `</pre>`; // 파일 내용 출력
    }
  
    reader.readAsText(files[0]); // 파일 읽기 시작
  }
  
  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // 드래그 앤 드롭 시 복사 효과 표시
  }

function deleteFieldsWithRef(obj, ref) {
  for(let key in obj) {
      if(typeof obj[key] === 'object' && obj[key] !== null) {
          deleteFieldsWithRef(obj[key], ref);
      } else if(key === '$ref' && obj[key] === ref) {
          delete obj[key];
      }
  }
}
  
  function generateClickEvent(){
    console.dir(cData.checked);
    console.dir(nCount.valueAsNumber);
    console.log(schema);
    if(cData.checked){
      if(schema.definitions.CustomDataType && Object.keys(schema.definitions.CustomDataType).length >0) delete schema.definitions.CustomDataType
      deleteFieldsWithRef(schema, '#/definitions/CustomDataType')
      delete schema.properties.customData;
    }
    let liList = [];
    for(let i = 1; i <= nCount.valueAsNumber; i++){
      JSONSchemaFaker.resolve(schema).then(res => {
        liList.push(JSON.parse(JSON.stringify(res)));
      })
    }
    liList.forEach(e => {
      let element = document.createElement('li');
      element.innerHTML = '<pre style="border:1px solid black;">' + JSON.stringify(e, null, 2) + `</pre>`
      fakerList.appendChild(element);
    })

  }
  
  dropZ.addEventListener('dragover', handleDragOver, false);
  dropZ.addEventListener('drop', handleFileSelect, false);
  
  generate.addEventListener('click', generateClickEvent);

}