$vm.today_weather_req=function(vm_contents,topic){
    var html="<div class=vm-today_weather_req>";
    html+="<input placeholder='City' style='width:150px' class=vm-input> <button>Submit</button>";
    html+="</div>";
    vm_contents.insertAdjacentHTML('beforeend',html);
    scroll();
    var div=vm_contents.lastElementChild;
    var input=div.querySelectorAll('input')[0];
    var submit=div.querySelectorAll('button')[0];
    var qq=function(tp){
        var q="What is today's weather?"+"|"+input.value;
        //var topic=vm_topic.value;
        var req={cmd:'qna',q:q,p:tp}
        $vm.request(req).then((res)=>{ show_answer("",tp,res.answer); })
        .catch(error => { console.log(error);});
    }
    submit.addEventListener('click',function(e){ qq(topic); })
    input.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  qq(topic);  }  })
    input.focus();
    vm_ask.value="";
}
//------------------------------------------------
$vm.today_weather_res=function(vm_contents,answer,topic){
    var data=JSON.parse(answer);
    var text="";
    text+="Name: "+data.location.name+"<br>";
    text+="Region: "+data.location.region+"<br>";
    text+="Country: "+data.location.country+"<br>";
    text+="Date: "+data.forecast.forecastday[0].date+"<br>";
    text+=data.forecast.forecastday[0].day.condition.text+"<br>";
    text+="Max: "+data.forecast.forecastday[0].day.maxtemp_c+"<br>";
    text+="Min: "+data.forecast.forecastday[0].day.mintemp_c+"<br>";
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div style='_margin-top:-20px'>"+text+"</div></div>");
    const vmDivs = document.querySelectorAll('div.vm-today_weather_req');
    vmDivs.forEach(vmDiv => vmDiv.remove());    
    $vm.today_weather_req(vm_contents,topic);
}
//------------------------------------------------
$vm.woolcock_profile_req=function(vm_contents,topic){
    var html="<div class=vm-wps>";
    html+="<input placeholder='Name' style='width:150px' class=vm-input> <button class=vm-wps-submit>Submit</button>";
    html+="</div>";
    vm_contents.insertAdjacentHTML('beforeend',html);
    scroll();
    var div=vm_contents.lastElementChild;
    var input=div.querySelectorAll('input')[0];
    var submit=div.querySelectorAll('button')[0];
    var qq=function(){
        var q="Woolcock staff profile"+"|"+input.value;
        var req={cmd:'qna',q:q,p:topic}
        $vm.request(req).then((res)=>{
            show_answer("",topic,res.answer);
        })
        .catch(error => { console.log(error);});
    }
    submit.addEventListener('click',function(e){ qq(); })
    input.addEventListener("keyup", function(e){ if (e.keyCode === 13) { qq(); }})
    input.focus();
    vm_ask.value="";
}
//------------------------------------------------
$vm.woolcock_profile_res=function(vm_contents,answer,topic){
    var data=JSON.parse(answer);
    var text="";
    for(var i=0;i<data.length;i++){
        text+="Name: "+data[i].displayName+"<br>";
        text+="Job Title: "+data[i].jobTitle+"<br>";
        text+="Email: "+data[i].mail+"<br>";
        text+="Phone: "+data[i].businessPhones[0]+"<br>";
        text+="Office Location: "+data[i].officeLocation+"<br>";
        text+="<br>"
    }
    if(data.length!=0) vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div style='_margin-top:-20px'>"+text+"</div></div>");
    const vmDivs = document.querySelectorAll('div.vm-wps');
    vmDivs.forEach(vmDiv => vmDiv.remove());    
    $vm.woolcock_profile_req(vm_contents,topic);
}
//------------------------------------------------
$vm.w_people_profile=function(vm_contents,answer,topic){
    console.log(answer)
    var data=JSON.parse(answer);
    var html="<img style='height: 150px; width: auto; float: left; margin-right:10px;' src=https://woolcock.org.au"+data[3]+"></img>"+data[0]+"<br>"+data[1]+"<br>"+data[2]+"<br>";
    var answer="<div class=vm-answer><div style='min-height:150px'>"+html+"</div></div></div>";
    vm_contents.insertAdjacentHTML('beforeend',answer);
    vm_ask.value="";
    scroll();
}
//------------------------------------------------
$vm.abc_notation=function(vm_contents,abc,aa0){
    var note="<span style='font-size:12px;color:#666'>Intended for melody prompts. The left hand improvises accompanying melodies, while the right hand inserts improvised notes.</span><br><br>";
    if(aa0=="abc2") note="";
    var answer="<div class=vm-answer-div><div class='vm-paper'></div>"+note+"<div class='vm-midi'></div></div>";
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+answer+"<div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    var paper=div.querySelector("div[class='vm-paper']");
    var midi=div.querySelector("div[class='vm-midi']");
    var abcOptions = {
        add_classes: true,
        responsive: "resize"
    };
    var visualObj=ABCJS.renderAbc(paper, abc, abcOptions);
    var controlOptions = {
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayClock: true
    };
    var synthControl = new ABCJS.synth.SynthController();
    synthControl.load(midi, null, controlOptions);
    synthControl.disable(true);
    var midiBuffer = new ABCJS.synth.CreateSynth();
    midiBuffer.init({
        visualObj: visualObj[0],
        options: {
            soundFontUrl:"https://gleitz.github.io/midi-js-soundfonts/FatBoy/",
        }
    }).then(function () {
        synthControl.setTune(visualObj[0], true).then(function (response) {
        document.querySelector(".abcjs-inline-audio").classList.remove("disabled");
        })
    });
    scroll();   
}
//--------------------------------------------
$vm.web_contents=function(vm_contents,param,topic){
    var answer="<div class=vm-answer-div></div>";
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer topic='"+topic+"'>"+answer+"<div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    var json=JSON.parse(param);
    var url=json.url;
    var text="";
    fetch(url)
    .then(response => response.text())
    .then(c=>{
        var sl=json.pos.length;
        var s1=json.pos[0];
        var s2=json.pos[1];
        var txt=$vm.get_text(c,s1,s2);
        for(var i=2;i<sl;i++){
            if(json.pos[i]!=undefined){
                var s1=json.pos[i][0];
                var s2=json.pos[i][1];
                var txt2=$vm.get_text(txt,s1,s2);
                var si=txt.indexOf(txt2);
                txt=txt.substring(si+txt2.length+4);
                text+="<p>"+txt2+"</p>";
            }
        }
        div.innerHTML=text;
        scroll();
    })
    .catch(e=>{
    });
}
//--------------------------------------------
$vm.login=function(vm_contents,tList,topic){
    var list=eval(tList);
    var text="";
    for(var i=0;i<list.length;i++){
        text+="<u>"+list[i]+"</u><br>"
    }
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div style='padding-left:6px;_margin-top:-20px'>"+text+"</div><div>");
    var us=vm_contents.lastElementChild.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            $vm.auth_signin(el.textContent);
        });
    });
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.chart=function(vm_contents,tConfig,topic){
    var config=JSON.parse(tConfig);
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div><canvas></canvas></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    //div.style["margin-top"]="-20px";
    var canvas=div.querySelector('canvas');
    new Chart(canvas,config);
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.table=function(vm_contents,tConfig,topic){
    var config=JSON.parse(tConfig);
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    //div.style["margin-top"]="-20px";
    var table=new Tabulator(div, {
        columns:config[0],
        data:config[1], 
        layout:"fitColumns"
    });
    table.on("renderComplete", function(data){
        scroll();
    });
    document.getElementById('vm_ask').value='';
}
//------------------------------------------------
$vm.data_to_grid_01=function(field,header,data){   
    var txt="<tr><th></th>";
    header.forEach((hh)=>{
        txt+="<th>"+hh+"</th>"
    })
    txt+="</tr>";
    var d="";
    data.forEach((dd)=>{
        d+="<tr><td><u>View</u></td>";
        field.forEach((hh)=>{
            var v=dd[hh]; if(v==undefined) v="";
            d+="<td>"+v+"</td>"
        })
        d+="</tr>"
    })
    return (txt+d)
}
//------------------------------------------------
$vm.grid_render=function(db,table,query,header,field){
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div class=vm-grid></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    var data=[]
    var bar="<input placeholder=keyword style='width:180px; border:1px solid #666; height:20px; padding-left:6px' /> <button>Searh</button> <label style='margin-left:30px'></label><br>";
    div.innerHTML=bar+"<table>"+$vm.data_to_grid_01(field,header,data)+"</table>";
    var inputE=div.querySelector('input');
    var qq=function(){
        var req={cmd:'find',db:db,table:table,query:query,limit:20,search:inputE.value}
        $vm.request(req)
        .then((r)=>{
            if(r.status=='np'){
                div.querySelector('label').innerText="No permissions.";
            }
            else{
                var d=r.result;
                var t=$vm.data_to_grid_01(field,header,d);
                div.querySelector('table').innerHTML=t;
                div.querySelector('label').innerText=d.length+"/"+r.count+"  ("+table+")";
                var us=div.querySelectorAll('u');
                us.forEach((el,i) => {
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        var options = {
                            collapsed: true,
                            rootCollapsable: false,
                        };
                        document.getElementById('vm_popup').innerHTML="<div id='vm_json_renderer'></div>";
                        new JsonViewer({
                            value: d[i].Data,
                            theme:'light',
                            displayDataTypes:false,
                            maxDisplayLength:100,
                            collapseStringsAfterLength:100
                        }).render('#vm_json_renderer')
                        $vm.open_popup();
                    });
                });
            }
            scroll();
        })
        .catch((e)=>{})
    }
    div.querySelector('button').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); qq(); });
    div.querySelector('input').addEventListener("keyup", function(e){ if (e.keyCode === 13) {  qq();  }  })
    qq();
    document.getElementById('vm_ask').value='';
    scroll();
};
//------------------------------------------------
$vm.grid01=function(vm_contents,A,topic){
    var ss=A.split("~~");
    var db=ss[0];
    var table=ss[1];
    var fds=ss[2].split(',');
    var field=[];   fds.forEach((item,i)=>{field.push(item.split('|')[0])});
    var header=[];  fds.forEach((item,i)=>{header.push(item.split('|').pop())});
    var query=JSON.parse(ss[3]);
    $vm.grid_render(db,table,query,header,field);
}
//------------------------------------------------
$vm.grid=function(vm_contents,A,topic){
    var a=JSON.parse(A);
    var db=a.db;
    table=a.table;
    var field=a.field.slice();     field.forEach((item,i)=>{field[i]=item.split('|')[0]});
    var header=a.field.slice();    header.forEach((item,i)=>{header[i]=item.split('|').pop()});
    var query=a.query;
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div class=vm-grid></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    var data=[]
    var bar="<input placeholder=keyword style='width:180px; border:1px solid #666; height:20px; padding-left:6px' /> <button>Search</button> <label style='margin-left:30px'></label><br>";
    div.innerHTML=bar+"<table>"+$vm.data_to_grid_01(field,header,data)+"</table>";
    var inputE=div.querySelector('input');
    var qq=function(){
        var req={cmd:'find',db:db,table:table,query:query,limit:20,search:inputE.value}
        $vm.request(req)
        .then((r)=>{
            if(r.status=='np'){
                div.querySelector('label').innerText="No permissions.";
            }
            else{
                var d=r.result;
                var t=$vm.data_to_grid_01(field,header,d);
                div.querySelector('table').innerHTML=t;
                div.querySelector('label').innerText=d.length+"/"+r.count+"  ("+table+")";
                var us=div.querySelectorAll('u');
                us.forEach((el,i) => {
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        var options = {
                            collapsed: true,
                            rootCollapsable: false,
                        };
                        document.getElementById('vm_popup').innerHTML="<div id='vm_json_renderer'></div>";
                        new JsonViewer({
                            value: d[i].Data,
                            theme:'light'
                        }).render('#vm_json_renderer')
                        $vm.open_popup();
                    });
                });
            }
            scroll();
        })
        .catch((e)=>{})
    }
    div.querySelector('button').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); qq(); });
    div.querySelector('input').addEventListener("keyup", function(e){ if (e.keyCode === 13) {  qq();  }  })
    qq();
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.gridjson=function(vm_contents,jdata){
    var data=JSON.parse(jdata);
    console.log(data)
    var txt="<tr><th></th>";
    data.header.forEach( (hh)=>{
        txt+="<th>"+hh.split('|').pop()+"</th>"
    })
    txt+="</tr>";
    var d="";
    data.rows.forEach((row,i)=>{
        d+="<tr><td><u I="+i+">View</u></td>";
        data.header.forEach((hh)=>{
            var id=hh.split('|')[0];
            var v=row[id]; if(v==undefined) v="";
            d+="<td>"+v+"</td>"
        })
        d+="</tr>";
    })
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div class=vm-grid></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    div.innerHTML="<table>"+txt+d+"</table>";
    var us=div.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => { 
            e.preventDefault(); e.stopPropagation(); var I=el.getAttribute('I'); 
            //var json={}
            //console.log(data.rows[I].cols);
            document.getElementById('vm_popup').innerHTML="<div id='vm_json_renderer'></div>";
            new JsonViewer({
                value: data.rows[I],
                theme:'light',
                displayDataTypes:false,
                maxDisplayLength:100,
                collapseStringsAfterLength:100
            }).render('#vm_json_renderer')
            $vm.open_popup();
         });
    })
}
//------------------------------------------------
$vm.gridjson_result=function(vm_contents,jdata){
    var data=JSON.parse(jdata);
    console.log(data)
    var txt="<tr>";
    data.header.forEach( (hh)=>{
        txt+="<th>"+hh.split('|').pop()+"</th>"
    })
    txt+="</tr>";
    var d="";
    data.rows.forEach((row,i)=>{
        d+="<tr>";
        data.header.forEach((hh)=>{
            var id=hh.split('|')[0];
            var v=row[id]; if(v==undefined) v="";
            d+="<td>"+v+"</td>"
        })
        d+="</tr>";
    })
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div class=vm-grid></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    div.innerHTML="<table>"+txt+d+"</table>";
}
//------------------------------------------------
$vm.gridjson_search=function(vm_contents,jdata){
    var data=JSON.parse(jdata);
    console.log(data)
    var bar="<input placeholder='"+data.bar_search+"' style='width:180px; border:1px solid #666; height:20px; padding-left:6px' /> <button>Searh</button> <label style='margin-left:30px'>"+data.bar_label+"</label><br>";
    var txt=bar+"<tr><th></th>";
    data.header.forEach( (hh)=>{
        txt+="<th>"+hh.split('|').pop()+"</th>"
    })
    txt+="</tr>";
    var d="";
    data.rows.forEach((row,i)=>{
        d+="<tr><td><u I="+i+">View</u></td>";
        data.header.forEach((hh)=>{
            var id=hh.split('|')[0];
            var v=row[id]; if(v==undefined) v="";
            d+="<td>"+v+"</td>"
        })
        d+="</tr>";
    })
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div class=vm-grid></div><div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    div.innerHTML="<table>"+txt+d+"</table>";
    var us=div.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => { 
            e.preventDefault(); e.stopPropagation(); var I=el.getAttribute('I'); 
            //var json={}
            //console.log(data.rows[I].cols);
            document.getElementById('vm_popup').innerHTML="<div id='vm_json_renderer'></div>";
            new JsonViewer({
                value: data.rows[I],
                theme:'light',
                displayDataTypes:false,
                maxDisplayLength:100,
                collapseStringsAfterLength:100
            }).render('#vm_json_renderer')
            $vm.open_popup();
         });
    })
    var inputE=div.querySelector('input');
    var qq=function(){
        var dd=data.this_question;
        if(inputE.value!="") dd+="|"+inputE.value;
        document.getElementById('vm_ask').value=dd;
        //vm_qq={};
        //vm_qq[el.textContent]=topic;
        query();
    }
    div.querySelector('button').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); qq(); });
    div.querySelector('input').addEventListener("keyup", function(e){ if (e.keyCode === 13) {  qq();  }  })
}
//------------------------------------------------
$vm.img=function(vm_contents,src,topic){
    var srcs=src.split('|');
    var txt="";
    for(var i=0;i<srcs.length;i++){
        txt+="<img rel='noopener noreferrer' style='_margin-top:-20px;width: 100%; height: auto;' src="+srcs[i]+"></img>"
    }
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div>"+txt+"</div><div>");
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.imgdata=function(vm_contents,src,topic){
    /*
    var srcs=src.split('|');
    var txt="";
    for(var i=0;i<srcs.length;i++){
        txt+="<img rel='noopener noreferrer' style='margin-top:-20px;width: 100%; height: auto;' src="+srcs[i]+"></img>"
    }
    */
   var txt="<img rel='noopener noreferrer' style='_margin-top:-20px;width: 100%; height: auto;' src="+src+"></img>"
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div>"+txt+"</div><div>");
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.audio=function(vm_contents,src,qq){
    var audio_str=localStorage.getItem("zhiming.au.audio_playlist");
    var audio_list={};
    if(audio_str!=null) audio_list=JSON.parse(audio_str);
    if(audio_list[qq]==undefined){
        audio_list[qq]=src;
        audio_str=JSON.stringify(audio_list);
        localStorage.setItem("zhiming.au.audio_playlist",audio_str);
    }
    console.log(audio_list);

    var txt=`
    <audio controls style='width:100%;height:30px; _margin-top:-30px'>
        <source src="`+src+`" type="audio/mpeg">
    </audio>
    `;
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+txt+"<div>");
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.playlist=function(vm_contents,src,qq){
    var audio_str=localStorage.getItem("zhiming.au.audio_playlist");
    var audio_list={};
    if(audio_str!=null) audio_list=JSON.parse(audio_str);

    var ul="";
    var playlist = [];
    var namelist = [];
    for(p in audio_list){
        playlist.push(audio_list[p]);
        namelist.push(p);
        ul+="<li><u>"+p+"</u></li>";
    }
    
    var txt=`
    <label>ABC</label>
    <audio crossorigin="anonymous" controls style='width:100%;height:30px;'>
    </audio>
    <ul>Remove`
    +ul+
    `</ul>
    `;
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+txt+"<div>");
    
    var div=vm_contents.lastElementChild;
    var eUL=div.querySelector('ul');
    var us=div.querySelectorAll('li');
    us.forEach(a=>{
        a.addEventListener('click', function() {
            var t=a.querySelector('u').textContent;
            alert(t)
            alert(audio_list[t])                
            if(audio_list[t]!=undefined){
                delete audio_list[t];
                var str=JSON.stringify(audio_list);
                localStorage.setItem("zhiming.au.audio_playlist",str);
                eUL.removeChild(a);
            }
        });
    })
    var LB=div.querySelector('label');
    var audioPlayer=div.querySelector('audio');
    var currentSongIndex = 0;

    audioPlayer.addEventListener('ended', function() {
        currentSongIndex++;
        if (currentSongIndex >= playlist.length) {
            currentSongIndex = 0; 
        }
        LB.textContent=namelist[currentSongIndex].replace('(Audio)','');
        audioPlayer.src = playlist[currentSongIndex];
        audioPlayer.play();
    });
    /*
    LB.textContent=namelist[currentSongIndex].replace('(Audio)','');
    audioPlayer.src = playlist[currentSongIndex];
    audioPlayer.play();
    */
    //try{ navigator.wakeLock.release(); }catch(e){}
    navigator.wakeLock.request('screen').then(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(audioContext.destination);
        LB.textContent=namelist[currentSongIndex].replace('(Audio)','');
        audioPlayer.src = playlist[currentSongIndex];
        audioPlayer.play();
    }).catch((error) => {
        console.error('Failed to acquire wake lock:', error);
    });
    

    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.questions_list=function(vm_contents,param,topic){
    var p=JSON.parse(param);
    var list=p[1];
    var questions="<b>"+topic+"</b><hr><table>";
    var i=0;
    list.forEach((a,I)=>{
        if(a.length>0){
            if(p[0]=="[Virtual Zhiming]" && I<7){}
            else {
                i++; 
                var uid=a.split('~')[0].trim();
                var text=a.split('~').pop().trim();
                questions+="<tr><td>"+i+"</td><td><u uid=\""+uid+"\">"+text+"</u></td></tr>";
            }
        }
    })
    questions+="</table>"
    var ccc=vm_nav;
    if (window.innerWidth <900) ccc=vm_contents;
    ccc.insertAdjacentHTML('beforeend',"<div class=vm-answer><div class=vm-questions>"+questions+"</div></div>");
    var us=ccc.lastElementChild.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            var topic=el.parentNode.getAttribute('topic');
            e.preventDefault();
            e.stopPropagation();
            //document.getElementById('vm_ask').value=el.textContent;
            document.getElementById('vm_ask').value=el.getAttribute('uid');
            vm_qq={};
            vm_qq[el.textContent]=topic;
            query();
        });
    });
    document.getElementById('vm_ask').value='';
    if($vm.first_query_nav==1){
        $vm.first_query_nav=0;
    }
    else vm_nav.scrollTop = vm_nav.scrollHeight;
    scroll();
}
//------------------------------------------------
$vm.multi=function(vm_contents,ans,q){
    var q0=document.getElementById('vm_ask').value;
    var aa=JSON.parse(ans);
    var txt="<b>["+q+"]</b><hr><table class='vm-multi'>";
    var i=0;
    aa.forEach((a,I)=>{
        if(a.length>0){
            i++; txt+="<tr><td>"+i+"</td><td>"+a[0].toFixed(3)+"</td><td><u>"+a[1]+"</u></td></tr>";
        }
    })
    txt+="<tr><td></td><td></td><td><u>Ask Wikipedia</u></td></tr>";
    txt+="</table>"
    var ccc=vm_nav;
    if (window.innerWidth <900) ccc=vm_contents;
    ccc.insertAdjacentHTML('beforeend',"<div class=vm-answer><div style='_margin-top:-20px'>"+txt+"</div><div>");
    var us=ccc.lastElementChild.querySelectorAll('u');
    us.forEach((el,i) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if(i<aa.length){
                document.getElementById('vm_ask').value=el.textContent;
                vm_qq={};
                query();
            }
            else if(i==aa.length){
                $vm.wiki_query(q0).then( (data)=>{
                    if(data!=""){
                        show_answer(q0, "Generic",data);
                    }
                    else{ 
                        show_sorry("","", q0);
                    }
                }).catch(error => { console.log(error)});
            }
        });
    });
    
    document.getElementById('vm_ask').value='';
    vm_nav.scrollTop = vm_nav.scrollHeight;
    scroll();
}
//------------------------------------------------
