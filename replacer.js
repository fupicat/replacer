const owa = '{"inputs":["\\n", " ", ";;", ";;", ";;"], "outputs":[";", "", ";", ";", ";"]}';
const text2morse = '{"inputs":[" ",".","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9","0",",","?","\'","!","(",")","&",":",";","=","+","$","@"], "outputs":["/ ",".-.-.- ",".- ","-... ","-.-. ","-.. ",". ","..-. ","--. ",".... ",".. ",".--- ","-.- ",".-.. ","-- ","-. ","--- ",".--. ","--.- ",".-. ","... ","- ","..- ","...- ",".-- ","-..- ","-.-- ","--.. ",".---- ","..--- ","...-- ","....- ","..... ","-.... ","--... ","---.. ","----. ","-----","--..-- ","..--.. ",".----. ","-.-.-- ","-.--. ","-.--.- ",".-... ","---... ","-.-.-. ","-...- ",".-.-. ","...-..- ",".--.-. "]}';
const morse2text = '{"inputs":["\\0", " .-.-.- "," .- "," -... "," -.-. "," -.. "," . "," ..-. "," --. "," .... "," .. "," .--- "," -.- "," .-.. "," -- "," -. "," --- "," .--. "," --.- "," .-. "," ... "," - "," ..- "," ...- "," .-- "," -..- "," -.-- "," --.. "," .---- "," ..--- "," ...-- "," ....- "," ..... "," -.... "," --... "," ---.. "," ----. "," -----"," --..-- "," ..--.. "," .----. "," -.-.-- "," -.--. "," -.--.- "," .-... "," ---... "," -.-.-. "," -...- "," .-.-. "," ...-..- "," .--.-. "," ","/"], "outputs":[" ", " . "," a "," b "," c "," d "," e "," f "," g "," h "," i "," j "," k "," l "," m "," n "," o "," p "," q "," r "," s "," t "," u "," v "," w "," x "," y "," z "," 1 "," 2 "," 3 "," 4 "," 5 "," 6 "," 7 "," 8 "," 9 "," 0 "," , "," ? "," \' "," ! "," ( "," ) "," & "," : "," ; "," = "," + "," $ "," @ ",""," "]}';

function addRule() {
  var rules = document.getElementById("rule-list");

  var divider = document.createElement('div');
  divider.className = 'rule';

  var paraA = document.createElement('p');
  var text = document.createTextNode('Substitua');
  paraA.appendChild(text);

  var inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.className = 'input';

  var paraB = document.createElement('p');
  text = document.createTextNode('por');
  paraB.appendChild(text);

  var outputElement = document.createElement('input');
  outputElement.type = 'text';
  outputElement.className = 'output';

  var delButt = document.createElement('button');
  text = document.createTextNode('Deletar');
  delButt.appendChild(text);
  delButt.type = 'button';
  delButt.name = 'delete';
  delButt.onclick = deleteRule;

  divider.appendChild(paraA);
  divider.appendChild(inputElement);
  divider.appendChild(paraB);
  divider.appendChild(outputElement);
  divider.appendChild(delButt);

  rules.appendChild(divider);
}

function deleteRule() {
  var elem = this.parentElement;
  elem.parentElement.removeChild(elem);
}

function format() {
  var inputText = document.getElementById('input-field').value;
  if (inputText.length == 0) {
    alert('A área de entrada está vazia!');
    return;
  }
  var result = inputText.replace(/(\r\n|\n|\r)/gm, '\\n');

  var rules = document.getElementById('rule-list').children;
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    var ruleInput = rule.getElementsByClassName('input')[0].value;
    var ruleOutput = String(rule.getElementsByClassName('output')[0].value);

    if (ruleInput.charAt(0) == '\\' && ruleInput.charAt(1) !== '\\' && ruleInput.charAt(1) !== '') {
      ruleInput = ruleInput.replace('\\', '');
      var chars = ruleInput.split('-');
      if (chars.length == 1 && (!isNaN(chars[0]) || chars[0] == 'end')) {
        var fromChar = chars[0];
        if (fromChar == 'end') {
          fromChar = result.length;
        }
        result = replaceAt(result, fromChar, fromChar, ruleOutput);
        continue;
      } else if (chars.length == 2 && (!isNaN(chars[0]) || chars[0] == 'end') && (!isNaN(chars[1]) || chars[1] == 'end')) {
        var fromChar = chars[0];
        if (fromChar == 'end') {
          fromChar = result.length;
        }
        var toChar = chars[1];
        if (toChar == 'end') {
          toChar = result.length;
        }
        result = replaceAt(result, fromChar, toChar, ruleOutput);
        continue;
      } else {
        ruleInput = ruleInput.replace('', '\\');
      }
    } else if (ruleInput.charAt(0) == '\\' && ruleInput.charAt(1) == '\\') {
      ruleInput = ruleInput.replace('\\', '');
    }

    var parts = result.split(ruleInput);
    for (var x = 0; x < parts.length; x++) {
      if (x == parts.length - 1) {
        break;
      }
      parts[x] = parts[x] + ruleInput;
    }

    for (var y = 0; y < parts.length; y++) {
      parts[y] = parts[y].replace(ruleInput, ruleOutput);
    }

    result = '';
    for (var z = 0; z < parts.length; z++) {
      result += parts[z];
    }
  }
  while (result.indexOf('\\n') !== -1) {
    var result = result.replace('\\n', '\n');
  }
  document.getElementById('output-field').value = result;
}

function template(text) {
  var rulesElement = document.getElementById('rule-list');

  var me = text;

  var parts = me.split('\\');
  for (var x = 0; x < parts.length; x++) {
    if (x == parts.length - 1) {
      break;
    }
    parts[x] = parts[x] + '\\';
  }

  for (var y = 0; y < parts.length; y++) {
    parts[y] = parts[y].replace('\\', '\\\\');
  }

  me = '';
  for (var z = 0; z < parts.length; z++) {
    me += parts[z];
  }

  console.log(me);

  var data = JSON.parse(me);

  while (rulesElement.lastChild) {
    rulesElement.removeChild(rulesElement.lastChild);
  }

  var rules = rulesElement.children;
  for (var i = 0; i < data.inputs.length; i++) {
    addRule();

    var addInput = data.inputs[i];

    var addOutput = data.outputs[i];

    rules[i].getElementsByClassName('input')[0].value = addInput;
    rules[i].getElementsByClassName('output')[0].value = data.outputs[i];
  }
}

function save() {
  var data = '{"inputs":['

  var rules = document.getElementById('rule-list').children;
  for (var i = 0; i < rules.length; i++) {
    var toAdd = rules[i].getElementsByClassName('input')[0].value;
    var addThis = '"' + toAdd + '"';
    if (i == rules.length - 1) {
      addThis += '], "outputs":[';
      data += addThis;
      break;
    }
    addThis += ',';
    data += addThis;
  }
  for (var i = 0; i < rules.length; i++) {
    var toAdd = rules[i].getElementsByClassName('output')[0].value;
    var addThis = '"' + toAdd + '"';
    if (i == rules.length - 1) {
      addThis += ']}';
      data += addThis;
      break;
    }
    addThis += ',';
    data += addThis;
  }
  download(data, 'template.json', 'application/json');
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function openFile() {
  document.getElementById('file-input').click();
  document.getElementById('file-input').addEventListener('change', templateFile);
}

function templateFile() {
  var data = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.readAsText(data, "UTF-8");
  reader.onload = function (evt) {
    try {
      var text = evt.target.result;

      var parts = text.split('\\');
      for (var x = 0; x < parts.length; x++) {
        if (x == parts.length - 1) {
          break;
        }
        parts[x] = parts[x] + '\\';
      }

      for (var y = 0; y < parts.length; y++) {
        parts[y] = parts[y].replace('\\', '\\\\');
      }

      text = '';
      for (var z = 0; z < parts.length; z++) {
        text += parts[z];
      }

      console.log(text);
      var rulesElement = document.getElementById('rule-list');
      var data = JSON.parse(text);

      while (rulesElement.lastChild) {
        rulesElement.removeChild(rulesElement.lastChild);
      }

      var rules = rulesElement.children;
      for (var i = 0; i < data.inputs.length; i++) {
        addRule();

        var addInput = data.inputs[i];

        var addOutput = data.outputs[i];

        rules[i].getElementsByClassName('input')[0].value = addInput;
        rules[i].getElementsByClassName('output')[0].value = addOutput;
      }
    } catch (e) {
      alert('O arquivo selecionado contém erros de sintaxe.');
    }
  }
}

function replaceAt(orig, index1, index2, subs) {
  var inicio = orig.substr(0, index1)
  var fim = orig.substr(index2, orig.length)
  return inicio + subs + fim;
}
