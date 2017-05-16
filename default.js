//初始化
var md = markdownit({
  html:         true,
  xhtmlOut:     false,
  breaks:       true,
  langPrefix:   'language-',
  linkify:      false, 
  typographer:  false,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
      	return '<pre class="hljs"><code>'+hljs.highlight(lang, str, true).value+'</code></pre>';
      } catch (e) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});
var input = document.getElementById('input');
var output = document.getElementById('output');
output.innerHTML = md.render(input.value);
input.focus();

//实时预览
function flash(){
  output.innerHTML = md.render(input.value);
}
if(!!window.ActiveXObject || "ActiveXObject" in window){  
    input.onpropertychange = flash(); 
}  
else{  
    input.addEventListener("input", flash, false);  
}
//同步滚动
var inputHeight = Number(input.clientHeight);
var outputHeight = Number(output.clientHeight);
var s = inputHeight/outputHeight;
function scroll(){
  console.log(input.scrollHeight+'--'+input.clientHeight+'--'+input.scrollTop+'--'+output.scrollHeight+'--'+output.clientHeight+'--'+output.scrollTop);
}
input.addEventListener("scroll",function(){
  var l = input.scrollTop/input.clientHeight;
  output.scrollTop = output.clientHeight*l;
},false);
output.addEventListener("scroll",function(){

},false);

//模态框
var modal = document.getElementById("modal-overlay");
var modalData = document.getElementById("modal-data");
function visibility(){
  modal.style.visibility = (modal.style.visibility == "visible")?"hidden":"visible";
}
//工具烂
var toolbtn = document.getElementById("toolbtn");
var tools = document.getElementById("tools");
toolbtn.onclick = function(){
  input.focus();
	if(tools.style.display == ""){
		tools.style.display="block";
		toolbtn.style.backgroundImage='url("font/less.svg")';
    input.focus();
	}else{
		tools.style.display="";
		toolbtn.style.backgroundImage='url("font/more_unfold.svg")';
    input.focus();
	}
};

//加粗
var bold = document.getElementById("bold");
bold.onclick = function(){
  input.focus();
  var start = input.selectionStart;
  var end = input.selectionEnd;
  if(start==end){
    input.value = input.value.substring(0,start)+'**strong text**'+input.value.substring(end,input.value.length);
    output.innerHTML = md.render(input.value);
    input.setSelectionRange(start+2,end+13);
  }else{
    if(document.getSelection()){
      var textBefore = input.value.substring(start,end);
      var text = input.value.substring(start,end).trim().replace(/[\r\n]/g, "");
      input.value = input.value.substring(0,start)+'**'+text+'**'+input.value.substring(end,input.value.length);
      output.innerHTML = md.render(input.value);
      input.setSelectionRange(start+2,end+2-textBefore.length+text.length);
    }
  }
}
//引用
var quote = document.getElementById("quote");
quote.onclick = function(){
  input.focus();
  var start = input.selectionStart;
  var end = input.selectionEnd;
  if(start==end){
    input.value = input.value.substring(0,start)+'\n>block quote\n'+input.value.substring(end,input.value.length);
    output.innerHTML = md.render(input.value);
    input.setSelectionRange(start+2,end+13);
  }else{
    if(document.getSelection()){
      var textBefore = input.value.substring(start,end);
      var text = input.value.substring(start,end).trim().replace(/[\r\n]/g, "");
      input.value = input.value.substring(0,start)+'\n>'+text+'\n'+input.value.substring(end,input.value.length);
      output.innerHTML = md.render(input.value);
      input.setSelectionRange(start+2,end+2-textBefore.length+text.length);
    }
  }
}
//代码块
var code = document.getElementById("code");
code.onclick = function(){
  input.focus();
  var start = input.selectionStart;
  var end = input.selectionEnd;
  if(start==end){
    input.value = input.value.substring(0,start)+'\n```\ncode block\n```\n'+input.value.substring(end,input.value.length);
    output.innerHTML = md.render(input.value);
    input.setSelectionRange(start+5,end+15);
  }else{
    if(document.getSelection()){
      var textBefore = input.value.substring(start,end);
      var text = input.value.substring(start,end).trim().replace(/[\r\n]/g, "");
      input.value = input.value.substring(0,start)+'\n```\n'+text+'\n```\n'+input.value.substring(end,input.value.length);
      output.innerHTML = md.render(input.value);
      input.setSelectionRange(start+5,end+5-textBefore.length+text.length);
    }
  }
}
//分割线
var line = document.getElementById("line");
line.onclick = function(){
  input.focus();
  var start = input.selectionStart;
  var end = input.selectionEnd;
  input.value = input.value.substring(0,start)+'\n\n---\n\n'+input.value.substring(end,input.value.length);
  output.innerHTML = md.render(input.value);
  end = start;
  input.setSelectionRange(start+6,end+6);
} 
//链接
var link = document.getElementById("link");
link.onclick = function(){
  modalData.innerHTML = '<h2>插入链接</h2><hr><input type="text" id="url" placeholder="http://example.com/"><button type="button" id="linkY">确认</button><button type="button" id="linkN">取消</button>';
  visibility();
  document.getElementById("linkN").onclick = function(){visibility();}
  document.getElementById("linkY").onclick = function(){
    var linkUrl = document.getElementById("url").value;
    input.focus();
    var start = input.selectionStart;
    var end = input.selectionEnd;
    input.value = input.value.substring(0,start)+'[Alt text]('+linkUrl+')'+input.value.substring(end,input.value.length);
    output.innerHTML = md.render(input.value);
    input.setSelectionRange(start+1,start+9);
    visibility();
  }
}
//图片
var pic = document.getElementById("pic");
pic.onclick = function(){
  modalData.innerHTML = '<h2>插入图片</h2><hr><input type="text" id="url" placeholder="http://example.com/image.jpg"><button type="button" id="picY">确认</button><button type="button" id="picN">取消</button>';
  visibility();
  document.getElementById("picN").onclick = function(){visibility();}
  document.getElementById("picY").onclick = function(){
    var picUrl = document.getElementById("url").value;
    input.focus();
    var start = input.selectionStart;
    var end = input.selectionEnd;
    input.value = input.value.substring(0,start)+'![Alt text]('+picUrl+')'+input.value.substring(end,input.value.length);
    output.innerHTML = md.render(input.value);
    input.setSelectionRange(start+2,start+10);
    visibility();
  }
}