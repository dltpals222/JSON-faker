const { JSONSchemaFaker } = require("json-schema-faker");

window.onload = function(){
  //id 태그 선언
  const dropZ = document.getElementById("dropZ");
  const resultOutput = document.getElementById("resultOutput");
  const nCount = document.getElementById("nCount");
  const generate = document.getElementById("generate");
  const cData = document.getElementById("c-Data");
  const fakerList = document.getElementById("faker_list");
  
  let originalSchema = '';
  let schema = '';
  
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  
    var files = evt.dataTransfer.files; // 드롭된 파일 리스트
    var reader = new FileReader(); // FileReader 객체 생성
  
    reader.onload = function(e) {
      originalSchema = JSON.parse(e.target.result); // 파일 내용을 변수에 저장
      schema = JSON.parse(JSON.stringify(originalSchema)); // 파일 내용을 변수에 저장
      resultOutput.innerHTML = '<pre>' + JSON.stringify(schema, null, 2) + `</pre>`; // 파일 내용 출력
      fakerList.innerHTML = ''
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
    while (fakerList.firstChild){
      fakerList.firstChild.remove();
    };
    if(!schema){
      alert('JSON 파일 혹은 내용이 없습니다.');
      return;
    }

    schema = JSON.parse(JSON.stringify(originalSchema))

    if(cData.checked){
      if(schema.definitions.CustomDataType && Object.keys(schema.definitions.CustomDataType).length >0) delete schema.definitions.CustomDataType
      deleteFieldsWithRef(schema, '#/definitions/CustomDataType')
      delete schema.properties.customData;
    }
    let loopNumber = nCount.valueAsNumber ? nCount.valueAsNumber : 1;
    for(let i = 1; i <= loopNumber; i++){
      JSONSchemaFaker.resolve(schema).then(res => {
        let element = document.createElement('li');
        element.innerHTML = i + '번째 <br><pre style="border:2px solid green;">' + JSON.stringify(res, null, 2) + `</pre>`
        fakerList.appendChild(element);
      })
    }

  }
  
  dropZ.addEventListener('dragover', handleDragOver, false);
  dropZ.addEventListener('drop', handleFileSelect, false);
  
  generate.addEventListener('click', generateClickEvent);

}