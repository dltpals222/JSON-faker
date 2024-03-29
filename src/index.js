const { JSONSchemaFaker } = require("json-schema-faker");

window.onload = function(){
  //id 태그 선언
  const dropZ = document.getElementById("dropZ");
  const resultOutput = document.getElementById("resultOutput");
  const nCount = document.getElementById("nCount");
  const generate = document.getElementById("generate");
  const cData = document.getElementById("c-Data");
  const fakerList = document.getElementById("faker_list");
  const modifyBtn = document.getElementById('modifyBtn'); // JSON 내용 수정 버튼
  const completeBtn = document.getElementById('completeBtn'); // JSON 내용 수정 완료 버튼
  const allCopy = document.getElementById('all-copy'); // 전체복사 버튼

  
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
  
// 생성버튼
function generateClickEvent() {
  console.log(schema);
  while (fakerList.firstChild) {
    fakerList.firstChild.remove();
  };
  if (!schema) {
    alert('JSON 파일 혹은 내용이 없습니다.');
    return;
  }

  schema = JSON.parse(JSON.stringify(originalSchema))

  if (cData.checked) {
    if (schema.definitions.CustomDataType && Object.keys(schema.definitions.CustomDataType).length > 0) delete schema.definitions.CustomDataType
    deleteFieldsWithRef(schema, '#/definitions/CustomDataType')
    delete schema.properties.customData;
  }
  let loopNumber = nCount.valueAsNumber ? nCount.valueAsNumber : 1;
  let promises = [];
  for (let i = 1; i <= loopNumber; i++) {
    let promise = JSONSchemaFaker.resolve(schema).then(res => {
      let element = document.createElement('li');
      element.innerHTML = '<div style="display:flex; justify-content: space-between;height:1.6em;"><div>' + i + `번째</div><div id="alertMessage${i}" class="fade-in-out" style="display:none;">복사되었습니다.</div> <button type="button">복사</button></div><pre style="border:2px solid green;">` + JSON.stringify(res, null, 2) + `</pre>`
      fakerList.appendChild(element);
    })
    promises.push(promise);
  }

  Promise.all(promises).then(() => {
    inputValueCopy()
  })
}
  

  // JSON 내용 수정 버튼
  modifyBtn.addEventListener('click', () => {
    const resultOutputInnerPre = document.querySelector("#resultOutput > pre");
    resultOutput.setAttribute('contenteditable','true');
    if(resultOutputInnerPre) resultOutputInnerPre.style.backgroundColor = '#333';
  });
  
  // 수정 완료 버튼
  completeBtn.addEventListener('click', () => {
    const resultOutputInnerPre = document.querySelector("#resultOutput > pre");
    resultOutput.setAttribute('contenteditable','false');
    if(resultOutputInnerPre) resultOutputInnerPre.style.backgroundColor = '#000';
    try {
      schema = JSON.parse(resultOutputInnerPre.textContent); 
    } catch (e) {
      alert('JSON 형식이 유효하지 않습니다');
    }
  });
  

  //전체복사 버튼
  allCopy.addEventListener('click',() => {
    const allData = [...document.querySelectorAll('#faker_list pre')].map(e => JSON.parse(e.textContent));
    if(allData.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
      alert('전체 복사 완료되었습니다.');
    } else {
      alert('복사할 데이터가 없습니다.')
    }
  });

  function inputValueCopy(){
    const buttonId = document.querySelectorAll('#faker_list button');
    const valueId = [...document.querySelectorAll('#faker_list pre')];
    buttonId.forEach((e,i)=>{
      let alertMessage = document.getElementById('alertMessage'+(i+1));
      e.addEventListener('click',()=>{
        alertMessage.style.display = 'none'
        navigator.clipboard.writeText(valueId[i].textContent)
        .then(() => {
          alertMessage.style.display = 'block'
        })
        .catch(e => {console.error('복사 실패: ', e), alert('복사 실패: ', e)})
      })
    })
  };
  
  dropZ.addEventListener('dragover', handleDragOver, false);
  dropZ.addEventListener('drop', handleFileSelect, false);
  
  generate.addEventListener('click', generateClickEvent);
}