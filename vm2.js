var query=function(){
    var q=document.getElementById("vm_ask").value;
    var p=document.getElementById("vm_topic").value;
    var req={cmd:'qna',q:q,p:p}
    $vm.request(req).then((res)=>{
        var qq=q;
        if(q=="") qq="What questions can you answer about the topic \""+res.topic+"\"";
        vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question ><span class=vm-q>Q: </span>"+qq+"<div>");
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
                    var T="";if(p!="") T="<i style='font-size:80%'>( I do not have an answer regarding the topic '"+p+"'. However, I will try to find an answer on a generic topic. )</i><br>";
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
    var A="<span class=vm-a>A: </span>"; 
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer topic='"+topic+"'>"+A+answer+"<div>");
    const myDiv = document.querySelector('#vm_contents').lastElementChild;
    const myElements = myDiv.querySelectorAll('u');
    myElements.forEach(element => {
        element.addEventListener('click', (event) => {
            var tt=element.parentNode.parentNode.getAttribute('topic');
            event.preventDefault();
            event.stopPropagation();
            document.getElementById('vm_ask').value=element.textContent;
            document.getElementById('vm_topic').value=tt;
            query();
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
    var A="<span class=vm-a style='margin-left:6px;' >A: </span>";
    var str="";
    for(var i=0;i<autocompleteArray.length;i++){
        str+="<u>"+autocompleteArray[i]+"</u><br>";
    }
    //console.log(str);
    var q2="What topics can you talk about?"
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question><span class=vm-q>Q: </span>"+q2+"<div>");
    vm_contents.insertAdjacentHTML('beforeend',A+"<div class=vm-questions>"+str+"<div>");
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
}
//------------------------------------------------
var set_autolist=function(autolist){
    var inputControl = document.getElementById("vm_topic");
    inputControl.addEventListener("input", function() {
        var currentValue = inputControl.value;
        var datalist = document.getElementById("vm_autolist");
        while (datalist.firstChild) {
            datalist.removeChild(datalist.firstChild);
        }
        var filteredArray = autolist.filter(function(item) {
            return item.toLowerCase().includes(currentValue.toLowerCase());
        });
        if (filteredArray.length > 0) {
            filteredArray.forEach(function(item) {
                var option = document.createElement("option");
                option.value = item;
                datalist.appendChild(option);
            });
        }
    });
}
//------------------------------------------------
var init=function(autolist){
    vm_ask.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  query();  }  })
    vm_ask.focus();
    vm_submit.addEventListener('click',function(e){ query(); })
    set_autolist(autolist);
    vm_topics.addEventListener('click',function(e){ show_all_topics(autolist); })
}
//------------------------------------------------
