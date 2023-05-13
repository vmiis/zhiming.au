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
    var t=document.getElementById("vm_topic").value;
    if(q=="" && t=="") return;
    var q2=q.replace(/\"[^"]*\"/g, '');
    var p=vm_qq[q2];
    if(p==undefined) p="";
    if(p=="" && t!="") p=t;
    while (vm_autolist_question.firstChild){ vm_autolist_question.removeChild(vm_autolist_question.firstChild); }
    while (vm_autolist_topic.firstChild) {  vm_autolist_topic.removeChild(vm_autolist_topic.firstChild); }
    var req={cmd:'qna',q:q,p:p}
    $vm.request(req).then((res)=>{
        var qq=q;
        if(q=="") qq="What questions can you answer about the topic \""+res.topic+"\"";
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
    var aa=["",""]; if(answer.toString().includes("@CODE@")) aa=answer.split("@CODE@");
    switch(aa[0]){
        case "chart":                   $vm.chart(vm_contents,aa[1],topic);                 break;
        case "table":                   $vm.table(vm_contents,aa[1],topic);                 break;
        case "train":                   $vm.train(vm_contents,aa[1],topic);                 break;
        case "login":                   $vm.login(vm_contents,aa[1],topic);                 break;
        case "questions":               $vm.questions_list(vm_contents,aa[1],topic);        break;
        case "web":                     $vm.web_contents(vm_contents,aa[1],topic);          break;
        case "abc":
        case "abc2":                    $vm.abc_notation(vm_contents,aa[1],aa[0]);          break;
        case "woolcock_profile_req":    $vm.woolcock_profile_req(vm_contents,topic);        break;
        case "woolcock_profile_res":    $vm.woolcock_profile_res(vm_contents,aa[1],topic);  break;
        case "today_weather_req":       $vm.today_weather_req(vm_contents,topic);           break;
        case "today_weather_res":       $vm.today_weather_res(vm_contents,aa[1],topic);     break;
        default:
            vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer topic='"+topic+"'>"+answer+"<div>");
            var div=vm_contents.lastElementChild.querySelector('div[vm]');
            if(div!=null){
                $vm.div_render(div);
            }
            document.getElementById('vm_ask').value='';
            scroll();
    }
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
    var A="";
    var str="";
    for(var i=0;i<autocompleteArray.length;i++){
        str+="<u>"+autocompleteArray[i]+"</u><br>";
    }
    var q2="What topics can you talk about?"
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
    if (window.innerWidth >900) vm_ask.focus();
}
//------------------------------------------------
var set_autolist_topic=function(autolist){
    vm_topic.addEventListener("input", function() {
        var currentValue = vm_topic.value.toLowerCase();
        var cvs=currentValue.split(' ');
        while (vm_autolist_topic.firstChild) {  vm_autolist_topic.removeChild(vm_autolist_topic.firstChild); }
        var list=[];
        for(var i=0;i<autolist.length;i++){
            if(list.length>9) break;
            for(var j=0;j<cvs.length;j++){
                if(cvs[j].length>0 && autolist[i].toLowerCase().includes(cvs[j].trim())){
                    list.push(autolist[i]);
                    break;
                }
            }
        }
        list.forEach(function(item) {
            var option = document.createElement("option");
            option.value = item;
            vm_autolist_topic.appendChild(option);
        });
    });
}
//------------------------------------------------
var vm_qq={};
var set_autolist_question=function(autolist){
    vm_ask.addEventListener("input", function() {
        var currentValue = vm_ask.value.toLowerCase();
        var currentValue=currentValue.replace(/\"[^"]*\"/g, '');
        var cvs=currentValue.split(' ');
        var currentTopic = vm_topic.value.toLowerCase();
        while (vm_autolist_question.firstChild){ vm_autolist_question.removeChild(vm_autolist_question.firstChild); }
        var list=[];
        for(var i=0;i<autolist.length;i++){
            if(list.length>9) break;
            if(currentTopic=="" || autolist[i][0].toLowerCase()==currentTopic){
                for(var j=0;j<autolist[i][1].length;j++){
                    if(list.length>9) break;
                    var Ki=0;
                    for(var k=0;k<cvs.length;k++){
                        if(autolist[i][1][j].toLowerCase().includes(cvs[k].trim())) Ki++;
                    }
                    if(Ki==cvs.length){
                        list.push(autolist[i][1][j]+"  |  "+autolist[i][0]);
                    }
                }
            }
        }
        vm_qq={};
        list.forEach(function(item) {
            var option = document.createElement("option");
            var ss=item.split('  |  ');
            option.value=ss[0];
            var a2=ss[0].replace(/\"[^"]*\"/g, '');
            vm_qq[a2]=ss[1];
            vm_autolist_question.appendChild(option);
        });
    });
}
//------------------------------------------------
$vm.number_of_topics=0;
$vm.number_of_questions=0;
var init2=function(list1,list2){
    var topic_list=list1.split(',').sort();
    $vm.number_of_topics=topic_list.length;
    var ss=list2.split('||');
    var question_list=[];
    for(var i=0;i<ss.length;i++){
        var tt=ss[i].split('~~');
        question_list.push([tt[0],tt[1].split('^^')]);
    }
    $vm.number_of_questions=question_list.length;
    vm_sign_in.addEventListener("click", function(e){ 
        document.getElementById('vm_ask').value="How to login?";
        vm_qq={};
        vm_qq["How to login?"]="login";
        query();
    })
        vm_sign_out.addEventListener("click", function(e){
        $vm.auth_signout();
    })
    vm_ask.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  query();  }  })
    vm_ask.focus();
    vm_submit.addEventListener('click',function(e){ query(); })
    vm_topic_submit.addEventListener('click',function(e){ 
        document.getElementById('vm_ask').value='';
        query(); 
    })
    vm_topic.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  
        document.getElementById('vm_ask').value='';
        query();  
    }})
    set_autolist_topic(topic_list);
    set_autolist_question(question_list);
    vm_topics.addEventListener('click',function(e){ show_all_topics(topic_list); })
    vm_train_me.addEventListener('click',function(e){  train(); })
    $vm.show_user();
    
    vm_num_topic.innerText=topic_list.length;
    var I=0;
    for(var i=0;i<question_list.length;i++){
        I+=question_list[i][1].length;
    }
    vm_num_ques.innerText=I;
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
                localStorage.setItem("zhiming.au.question_list",res.question_list);
                var list2=res.question_list;
                init2(list1,list2);
            })
        }
        else{
            console.log('No new list');
            init2(topic_list,question_list);
        }
    })
}
//------------------------------------------------
$vm.abc_cursor_control=function(paper) {
    var self = this;

    self.onReady = function() {
    };
    self.onStart = function() {
        var svg = paper.querySelector("svg");
        var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cursor.setAttribute("class", "abcjs-cursor");
        cursor.setAttributeNS(null, 'x1', 0);
        cursor.setAttributeNS(null, 'y1', 0);
        cursor.setAttributeNS(null, 'x2', 0);
        cursor.setAttributeNS(null, 'y2', 0);
        svg.appendChild(cursor);

    };
    self.beatSubdivisions = 2;
    self.onBeat = function(beatNumber, totalBeats, totalTime) {
    };
    self.onEvent = function(ev) {
        if (ev.measureStart && ev.left === null)
            return; // this was the second part of a tie across a measure line. Just ignore it.

        var lastSelection = paper.querySelectorAll("svg .highlight");
        for (var k = 0; k < lastSelection.length; k++)
            lastSelection[k].classList.remove("highlight");

        for (var i = 0; i < ev.elements.length; i++ ) {
            var note = ev.elements[i];
            for (var j = 0; j < note.length; j++) {
                note[j].classList.add("highlight");
            }
        }

        var cursor = paper.querySelector("svg .abcjs-cursor");
        if (cursor) {
            cursor.setAttribute("x1", ev.left - 2);
            cursor.setAttribute("x2", ev.left - 2);
            cursor.setAttribute("y1", ev.top);
            cursor.setAttribute("y2", ev.top + ev.height);
        }
    };
    self.onFinished = function() {
        var els = paper.querySelectorAll("svg .highlight");
        for (var i = 0; i < els.length; i++ ) {
            els[i].classList.remove("highlight");
        }
        var cursor = paper.querySelector("svg .abcjs-cursor");
        if (cursor) {
            cursor.setAttribute("x1", 0);
            cursor.setAttribute("x2", 0);
            cursor.setAttribute("y1", 0);
            cursor.setAttribute("y2", 0);
        }
    };
}
//------------------------------------------------
$vm.abc_load=function(paper,midi,abc){
    var abcOptions = {
        add_classes: true,
        responsive: "resize"
    };
    var cursorControl = new $vm.abc_cursor_control(paper);
    var synthControl = new ABCJS.synth.SynthController();
    synthControl.load(midi, cursorControl, {displayLoop: true, displayRestart: true, displayPlay: true, displayProgress: true, displayWarp: true,
        midiTranspose:0,
        chordsOff:true,
        soundFontUrl:"https://gleitz.github.io/midi-js-soundfonts/FatBoy/",
        soundFontVolumeMultiplier:5
    });
    function setTune(userAction) {
        synthControl.disable(true);
        var visualObj = ABCJS.renderAbc(paper, abc, abcOptions)[0];

        var midiBuffer = new ABCJS.synth.CreateSynth();
        midiBuffer.init({
            visualObj: visualObj,
        }).then(function (response) {
            if (synthControl) {
                synthControl.setTune(visualObj, userAction).then(function (response) {
                }).catch(function (error) { console.warn("Audio problem:", error); });
            }
        }).catch(function (error) { console.warn("Audio problem:", error); });
    }
    setTune(false);
}
//------------------------------------------------
