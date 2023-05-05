//--------------------------------------------------------------
var train=function(){
    var html="<div class=vm-train>";
    html+="";
    html+="<input placeholder='Question'>";
    html+="<textarea placeholder='Answer'></textarea>"
    html+="<button class=vm-train-submit>Submit</button><label>Thank you for training me.</label> <button class=vm-train-submit>Train Again</button>";
    html+="</div>";
    vm_contents.insertAdjacentHTML('beforeend',html);
    scroll();
    var div=vm_contents.lastElementChild;
    var q=div.querySelectorAll('input')[0];
    var a=div.querySelectorAll('textarea')[0];
    var s=div.querySelectorAll('button')[0];
    var s2=div.querySelectorAll('button')[1];
    var l=div.querySelectorAll('label')[0];
    l.style.display='none';
    s2.style.display='none';
    s.addEventListener('click',function(e){ 
        s.style.display='none';
        l.style.display='inline-block';
        s2.style.display='inline-block';

        var req={cmd:'train',q:q.value,a:a.value}
        console.log("training request send");
        $vm.request(req).then((res)=>{
            console.log("training respobse:"+res.qna);
        })
        .catch(error => { console.log(error);});
    })
    s2.addEventListener('click',function(e){ 
        q.value='';
        a.value='';
        s.style.display='inline-block';
        l.style.display='none';
        s2.style.display='none';
    })
}
//------------------------------------------------
var query=function(){
    var q=document.getElementById("vm_ask").value;
    var p=document.getElementById("vm_topic").value;
    if(p==""){
        var ss=q.split('  |  ');
        if(ss.length==2){
            q=ss[0];
            p=ss[1];
        }
    }
    while (vm_autolist_question.firstChild){ vm_autolist_question.removeChild(vm_autolist_question.firstChild); }
    while (vm_autolist_topic.firstChild) {  vm_autolist_topic.removeChild(vm_autolist_topic.firstChild); }
    var req={cmd:'qna',q:q,p:p}
    $vm.request(req).then((res)=>{
        var qq=q;
        if(q=="") qq="What questions can you answer about the topic \""+res.topic+"\"";
        //vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question ><span class=vm-q>Q: </span>"+qq+"<div>");
        vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question >"+qq+"<div>");
        console.log(parseFloat(res.rank).toFixed(2)+ " | "+parseFloat(res.score).toFixed(2)+"  |  "+res.topic+"  |  "+res.question+"  |  "+res.answer);
        var answer=res.answer;
        var topic=res.topic;
        if(res.score!=0){
            show_answer(topic,answer);
        }
        else{
            $vm.wiki_query(q).then( (data)=>{
                if(data!=""){
                    var p=document.getElementById("vm_topic").value;
                    var T="";if(p!="") T="<i style='color:#aaa;font-size:80%'>( I do not have an answer regarding the topic '"+p+"'. However, I will try to find an answer on a generic topic. )</i><br>";
                    show_answer("Generic",T+data);
                }
                else{ 
                    show_sorry(q);
                }
            }).catch(error => { console.log(error)});
        }
    })
    .catch(error => { console.log(error);});
}
//------------------------------------------------
var show_answer=function(topic, answer){
    var A="";//"<span class=vm-a>A: </span>"; 
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer topic='"+topic+"'>"+A+answer+"<div>");
    var us=vm_contents.lastElementChild.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            var tg=el.getAttribute('tg');
            switch(tg){
                case 'auth': 
                    $vm.auth_signin(el.textContent);
                    break;
                case 'train': 
                    train();
                    break;
                default:
                    var topic=el.parentNode.parentNode.getAttribute('topic');
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById('vm_ask').value=el.textContent;
                    document.getElementById('vm_topic').value=topic;
                    query();
            }
        });
    });
    document.getElementById('vm_ask').value='';
    if(topic!="") vm_c_topic.innerHTML=topic;
    scroll();
}
//------------------------------------------------
var show_sorry=function(q){
    var answer="Sorry, I am not confident to provide correct information.";
    const chineseRegex = /[\u4e00-\u9fa5]/; 
    if(chineseRegex.test(q))  answer="很抱歉，没有合适的信息。";
    show_answer("",answer);
}
//------------------------------------------------
var show_all_topics=function(autocompleteArray){
    //var A="<span class=vm-a style='margin-left:6px;' >A: </span>";
    var A="";
    var str="";
    for(var i=0;i<autocompleteArray.length;i++){
        str+="<u>"+autocompleteArray[i]+"</u><br>";
    }
    //console.log(str);
    var q2="What topics can you talk about?"
    //vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question><span class=vm-q>Q: </span>"+q2+"<div>");
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question>"+q2+"<div>");
    vm_contents.insertAdjacentHTML('beforeend',A+"<div class=vm-answer><div class=vm-questions>"+str+"<div></div>");
    scroll();    
    
    const LD = document.querySelector('#vm_contents').lastElementChild;
    const myU = LD.querySelectorAll('u');
    myU.forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            document.getElementById('vm_topic').value=element.textContent;
            query();
        });
    });
}
//------------------------------------------------
var scroll=function(){
    vm_scroll.scrollTop = vm_scroll.scrollHeight;
    vm_ask.focus();
}
//------------------------------------------------
var set_autolist_topic=function(autolist){
    vm_topic.addEventListener("input", function() {
        var currentValue = vm_topic.value.toLowerCase();
        var cvs=currentValue.split(' ');
        while (vm_autolist_topic.firstChild) {  vm_autolist_topic.removeChild(vm_autolist_topic.firstChild); }
        var list=[];
        for(var i=0;i<autolist.length;i++){
            if(list.length>1) break;
            for(var j=0;j<cvs.length;j++){
                if(cvs[j].length>0 && autolist[i].toLowerCase().includes(cvs[j].trim())){
                    list.push(autolist[i]);
                    break;
                }
            }
        }
        if (list.length > 0) {
            list.forEach(function(item) {
                var option = document.createElement("option");
                option.value = item;
                vm_autolist_topic.appendChild(option);
            });
        }
    });
}
//------------------------------------------------
var set_autolist_question=function(autolist){
    vm_ask.addEventListener("input", function() {
        var currentValue = vm_ask.value.toLowerCase();
        var cvs=currentValue.split(' ');
        var currentTopic = vm_topic.value.toLowerCase();
        while (vm_autolist_question.firstChild){ vm_autolist_question.removeChild(vm_autolist_question.firstChild); }
        var list=[];
        //console.log(list)
        //console.log(cvs)
        for(var i=0;i<autolist.length;i++){
            if(list.length>1) break;
            if(currentTopic=="" || autolist[i][0].toLowerCase()==currentTopic){
                for(var j=0;j<autolist[i][1].length;j++){
                    if(list.length>1) break;
                    var Ki=0;
                    for(var k=0;k<cvs.length;k++){
                        if(autolist[i][1][j].toLowerCase().includes(cvs[k].trim())) Ki++;
                    }
                    if(Ki==cvs.length){
                        if(currentTopic=="")  list.push(autolist[i][1][j]+"  |  "+autolist[i][0]);
                        else list.push(autolist[i][1][j]);
                    }
                }
            }
        }
        //console.log(list)
        if (list.length > 0) {
            list.forEach(function(item) {
                var option = document.createElement("option");
                option.value = item;
                vm_autolist_question.appendChild(option);
            });
        }
    });
}
//------------------------------------------------
var init2=function(list1,list2){
    var topic_list=list1.split(',').sort();
    var ss=list2.split('||');
    var question_list=[];
    for(var i=0;i<ss.length;i++){
        var tt=ss[i].split('~~');
        question_list.push([tt[0],tt[1].split('^^')]);
    }
    vm_sign_in.addEventListener("click", function(e){ 
        document.getElementById('vm_ask').value="How to login?";
        document.getElementById('vm_topic').value="login"; 
        query();
        })
        vm_sign_out.addEventListener("click", function(e){
        $vm.auth_signout();
        })
    vm_ask.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  query();  }  })
    vm_ask.focus();
    vm_submit.addEventListener('click',function(e){ query(); })
    set_autolist_topic(topic_list);
    set_autolist_question(question_list);
    vm_topics.addEventListener('click',function(e){ show_all_topics(topic_list); })
    vm_train_me.addEventListener('click',function(e){  train(); })
    $vm.show_user();
}
//------------------------------------------------
var init=function(){
    var list_mtime=localStorage.getItem("zhiming.au.list_mtime");
    var topic_list=localStorage.getItem("zhiming.au.topic_list");
    var question_list=localStorage.getItem("zhiming.au.question_list");
    var req={cmd:'ai-list',datetime:1}
    var q=0;
    $vm.request(req).then((res)=>{
        mtime=res.mtime;
        var dt1=new Date(mtime);
        if(list_mtime==null){ localStorage.setItem("zhiming.au.list_mtime",mtime); q=1;}
        else{
            var dt2=new Date(list_mtime);
            if(dt1>dt2 ){ localStorage.setItem("zhiming.au.list_mtime",mtime); q=1;}
        }
        if(q==1){
            var req={cmd:'ai-list'}
            $vm.request(req).then((res)=>{
                console.log('New list');
                localStorage.setItem("zhiming.au.topic_list",res.topic_list);
                var list1=res.topic_list;
                //console.log(list1);
                localStorage.setItem("zhiming.au.question_list",res.question_list);
                var list2=res.question_list;
                //console.log(list2);
                init2(list1,list2);
            })
        }
        else{
            console.log('No new list');
            //console.log(topic_list);
            //console.log(question_list);
            init2(topic_list,question_list);
        }
    })
}
//------------------------------------------------
