//--------------------------------------------------------------
$vm.train=function(){
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
        $vm.request(req).then((res)=>{
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
$vm.recent=function(vm_contents,text,topic){
//console.log(text);    
    var lines=text.split("\r\n")
    var txt="";
    for(var i=0;i<lines.length;i++){
        txt+="<u>"+lines[i]+"</u><br>"    
    }
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+txt+"<div>");
    var us=vm_contents.lastElementChild.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            query(el.textContent,"_recent");
        });
    });
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
var query=function(qq,tt){
    var q=document.getElementById("vm_ask").value;
    var t=document.getElementById("vm_topic").value;
    if(qq!=undefined) q=qq;
    if(tt!=undefined) t=tt;
    if(q=="" && t=="") return;
    var q2=q.replace(/\"[^"]*\"/g, '');
    var p=vm_qq[q2];
    if(p==undefined) p="";
    if(p=="" && t!="") p=t;
    while (vm_autolist_question.firstChild){ vm_autolist_question.removeChild(vm_autolist_question.firstChild); }
    while (vm_autolist_topic.firstChild) {  vm_autolist_topic.removeChild(vm_autolist_topic.firstChild); }
    var i=-1;
    var qs=$vm.ai_list[t];
    if(qs!=undefined) i=qs.indexOf(q);
    var req={cmd:'qna',q:q,p:p,i:i}
    $vm.request(req).then((res)=>{
        var qq=q;
        //if(q=="") qq="What questions can you answer about the topic \""+p+"\"";
        vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question >"+qq+"<div>");
        var answer=res.answer;
        //var topic=res.topic;
        if(res.score>0.8 || res.score==-1){
            show_answer(p,answer);
        }
        else{
            $vm.wiki_query(q).then( (data)=>{
                if(data!=""){
                    //var p=document.getElementById("vm_topic").value;
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
$vm.multi=function(vm_contents,ans,topic){
    var q0=document.getElementById('vm_ask').value;
    var aa=JSON.parse(ans);
    var txt="";
    txt+=aa[0][0].toFixed(5)+"&nbsp &nbsp <u>"+aa[1][0]+"</u><br>";
    txt+=aa[0][1].toFixed(5)+"&nbsp &nbsp <u>"+aa[1][1]+"</u><br>";
    txt+=aa[0][2].toFixed(5)+"&nbsp &nbsp <u>"+aa[1][2]+"</u><br>";
    txt+="<br>";
    txt+="<u>Ask Wikipedia</u>"
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+txt+"<div>");
    var us=vm_contents.lastElementChild.querySelectorAll('u');
    us.forEach((el,i) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if(i<3){
                document.getElementById('vm_ask').value=el.textContent;
                vm_qq={};
                query();
            }
            else{
                $vm.wiki_query(q0).then( (data)=>{
                    if(data!=""){
                        show_answer("Generic",data);
                    }
                    else{ 
                        show_sorry(q0);
                    }
                }).catch(error => { console.log(error)});
            }
        });
    });
    
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
var show_answer=function(topic, answer){
    var aa=["",""]; if(answer.toString().includes("@CODE@")) aa=answer.split("@CODE@");
    switch(aa[0]){
        case "recent":                  $vm.recent(vm_contents,aa[1],topic);                break;
        case "multi":                   $vm.multi(vm_contents,aa[1],topic);                 break;
        case "audio":                   $vm.audio(vm_contents,aa[1],topic);                 break;
        case "img":                     $vm.img(vm_contents,aa[1],topic);                   break;
        case "grid":                    $vm.grid(vm_contents,aa[1],topic);                  break;
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
        case "w_people_profile":        $vm.w_people_profile(vm_contents,aa[1]);        break;
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
var set_autolist_topic=function(){
    vm_topic.addEventListener("input", function() {
        var currentValue = vm_topic.value.toLowerCase();
        var cvs=currentValue.split(' ');
        while (vm_autolist_topic.firstChild) {  vm_autolist_topic.removeChild(vm_autolist_topic.firstChild); }
        var list=[];
        for(var i=0;i<$vm.topic_list.length;i++){
            if(list.length>9) break;
            for(var j=0;j<cvs.length;j++){
                if(cvs[j].length>0 && $vm.topic_list[i].toLowerCase().includes(cvs[j].trim())){
                    list.push($vm.topic_list[i]);
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
var set_autolist_question=function(){
    vm_ask.addEventListener("input", function() {
        var currentValue = vm_ask.value.toLowerCase();
        var currentValue=currentValue.replace(/\"[^"]*\"/g, '');
        var cvs=currentValue.split(' ');
        var currentTopic = vm_topic.value.toLowerCase();
        while (vm_autolist_question.firstChild){ vm_autolist_question.removeChild(vm_autolist_question.firstChild); }
        var list=[];
        if(currentTopic==""){
            $vm.topic_list.forEach(a=>{
                if(list.length>9) return;
                $vm.ai_list[a].forEach(b=>{
                    if(list.length>9) return;
                    var Ki=0;
                    for(var k=0;k<cvs.length;k++){
                        if(b.toLowerCase().includes(cvs[k].trim())) Ki++;
                    }
                    if(Ki==cvs.length){
                        list.push(b+"  |  "+a);
                    }
                })
            })
        }
        else if($vm.ai_list[currentTopic]!=undefined){
            $vm.ai_list[currentTopic].forEach((b,ii)=>{
                if(list.length>9) return;
                var Ki=0;
                for(var k=0;k<cvs.length;k++){
                    if(currentTopic=="virtual zhiming" && ii<5){ } 
                    else{
                        if(b.toLowerCase().includes(cvs[k].trim())) Ki++;
                    }
                }
                if(Ki==cvs.length){
                    list.push(b+"  |  "+currentTopic);
                }
            })
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
var init2=function(){
    $vm.topic_list=[];
    var n1=0,n2=0;
    for (var key in $vm.ai_list) {
        if ($vm.ai_list.hasOwnProperty(key)) {
            n1++;
            n2+=$vm.ai_list[key].length;
            $vm.topic_list.push(key);
        }
    }
    //vm_num_topic.innerText=n1;
    //vm_num_ques.innerText=n2;
    vm_sign_in.addEventListener("click", function(e){ 
        document.getElementById('vm_ask').value="How to login?";
        vm_qq={};
        vm_qq["How to login?"]="Login";
        query();
    })
    vm_sign_out.addEventListener("click", function(e){
        $vm.auth_signout();
    })
    //---------------------------------------------
    vm_ask.focus();
    vm_submit.addEventListener('click',function(e){ query(); })
    vm_topic_submit.addEventListener('click',function(e){ 
        document.getElementById('vm_ask').value='';
        query(); 
    })
    //---------------------------------------------
    vm_ask.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  query();  }  })
    //---------------------------------------------
    vm_topic.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  
        document.getElementById('vm_ask').value='';
        query();  
    }})
    //---------------------------------------------
    vm_topics.addEventListener('click',function(e){ show_all_topics(topic_list); })
    //vm_train_me.addEventListener('click',function(e){  train(); })
    $vm.show_user();
    var a=window.location.href.split('?'); 
    if(a.length==2){
        var qt=a[1].split('@')
        if(qt.length==2){
            var q=decodeURIComponent(qt[0]);
            var t=decodeURIComponent(qt[1]);
            query(q,t);
        }
        else if(qt.length==1){
            var q=decodeURIComponent(qt[0]);
            query(q);
        }
    }
}
//------------------------------------------------
$vm.ai_list={};
var init=function(){
    set_autolist_topic();
    set_autolist_question();
    var list_mtime=localStorage.getItem("zhiming.au.topic-question-list-mtime"); if(list_mtime==null) list_mtime=0;
    var list=localStorage.getItem("zhiming.au.topic-question-list");
    var old_list={}; if(list!=null) old_list=JSON.parse(list); $vm.ai_list=old_list;
    //console.log($vm.ai_list)
    var req={cmd:'ai-list',datetime:list_mtime}
    $vm.request(req).then((res)=>{
        var newL=0;
        $vm.ai_list={};
        res.list.forEach(a=>{
            if(a.contents!=""){ $vm.ai_list[a.name]=a.contents; newL=1; }
            else $vm.ai_list[a.name]=old_list[a.name];
        })
        if(newL==1){
            localStorage.setItem("zhiming.au.topic-question-list",JSON.stringify($vm.ai_list));
            localStorage.setItem("zhiming.au.topic-question-list-mtime",new Date().toISOString());
            //console.log($vm.ai_list)
        }
        init2();
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
$vm.open_popup=function(){    document.getElementById('vm_popup_p').style.top="50%";}
$vm.close_popup=function(){    document.getElementById('vm_popup_p').style.top="100000px";}
document.getElementById('vm_close_popup').addEventListener('click',function(){    $vm.close_popup(); })
//------------------------------------------------
