//--------------------------------------------
$vm.api_address='https://api.zhiming.au'; if(window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost') $vm.api_address='http://localhost:8001';
$vm.ai_list={};
$vm.update_ai_list=function(cb){
    var list=localStorage.getItem("zhiming.au.topic-question-list");
    var old_list={}; if(list!=null) old_list=JSON.parse(list); $vm.ai_list=old_list;
    var mtime={}
    for(key in old_list){
        var mt=localStorage.getItem("zhiming.au.mtime"+key);
        if(mt!=null) mtime[key]=mt;
    }
    var req={cmd:'ai-list',datetime:mtime}
    $vm.request(req).then((res)=>{
        $vm.ai_list={};
        res.list.forEach(a=>{
            if(a.contents!=""){ 
                $vm.ai_list[a.name]=a.contents; 
                localStorage.setItem("zhiming.au.mtime"+a.name, new Date().toISOString());
            }
            else $vm.ai_list[a.name]=old_list[a.name];
        })
        localStorage.setItem("zhiming.au.topic-question-list",JSON.stringify($vm.ai_list));
        cb();
    })
}
//------------------------------------------------
$vm.dsiplay_ai_list=function(){
    const chineseRegex = /[\u4e00-\u9fa5]/; 
    var txt="";
    for(key in $vm.ai_list){
        txt+="<u>"+key+"</u><br>";
    }
    var div=document.getElementById("vm_nav");
    div.innerHTML=txt;
    var us=div.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if(chineseRegex.test(el.textContent)) window.open(window.location.href.split('nav.html')[0]+"?"+"【"+el.textContent+"】");
            else window.open(window.location.href.split('nav.html')[0]+"?"+"["+el.textContent+"]");
        });
    });
}
//------------------------------------------------
$vm.update_ai_list($vm.dsiplay_ai_list);
//--------------------------------------------
