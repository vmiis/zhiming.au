$vm={api_address:"https://api.zhiming.au"},"127.0.0.1"!=window.location.hostname&&"localhost"!=window.location.hostname||($vm.api_address="http://localhost:8001"),$vm.request=function(t){return new Promise((l,o)=>{var e=sessionStorage.getItem("vm_token");null==e&&(e=""),fetch($vm.api_address,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify(t)}).then(e=>e.json()).then(e=>{l(e)}).catch(e=>{o(e)})})},!function(){var error=0,N=0,I=0,callback=function(code,nm,local){if(null!=code&&console.log(nm+" is running, from local: "+local),null!=code)try{eval(code)}catch(e){console.log(nm+" running with error: "+e)}I++,I==N&&(0==error?(console.log("Start"),$vm.init()):console.log("Start:error"))},req={cmd:"client-init"};$vm.request(req).then(e=>{console.log(e.result),"ok"==e.status?(N=e.result.length,e.result.forEach(l=>{var e,o=localStorage.getItem("vm-client-code-"+l.file+"-mtime");null!=o?new Date(o)<new Date(l.mtime)?(e={cmd:"client-module",name:l.file},$vm.request(e).then(e=>{"ok"==e.status?(localStorage.setItem("vm-client-code-"+l.file+"-mtime",l.mtime),localStorage.setItem("vm-client-code-"+l.file,e.result),callback(e.result,l.file,0)):(console.log("server error:"+l.file),error=1,callback(null,l.file,3))})):null==(o=localStorage.getItem("vm-client-code-"+l.file))?(erroe=1,console.log("local error:"+l.file),callback(o,l.file,3)):callback(o,l.file,1):(e={cmd:"client-module",name:l.file},$vm.request(e).then(e=>{"ok"==e.status?(localStorage.setItem("vm-client-code-"+l.file+"-mtime",l.mtime),localStorage.setItem("vm-client-code-"+l.file,e.result),callback(e.result,l.file,0)):(console.log("server error:"+l.file),error=1,callback(null,l.file,3))}))})):(console.log("server error: module list"),error=1)})}();