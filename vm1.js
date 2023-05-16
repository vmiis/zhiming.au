$vm.today_weather_req=function(vm_contents,topic){
    var html="<div class=vm-today_weather_req>";
    html+="<input placeholder='City' style='width:150px' class=vm-input> <button>Submit</button>";
    html+="</div>";
    vm_contents.insertAdjacentHTML('beforeend',html);
    scroll();
    var div=vm_contents.lastElementChild;
    var input=div.querySelectorAll('input')[0];
    var submit=div.querySelectorAll('button')[0];
    var qq=function(){
        var q="What is today's weather?"+" "+input.value;
        var req={cmd:'qna',q:q,p:topic}
        $vm.request(req).then((res)=>{ show_answer(topic,res.answer); })
        .catch(error => { console.log(error);});
    }
    submit.addEventListener('click',function(e){ qq(); })
    input.addEventListener("keyup", function(e){ if (e.keyCode === 13) {  qq();  }  })
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
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+text+"<div>");
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
        var q="I would like to see someone's profile in Woolcock"+" "+input.value;
        var req={cmd:'qna',q:q,p:topic}
        $vm.request(req).then((res)=>{
            show_answer(topic,res.answer);
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
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+text+"<div>");
    const vmDivs = document.querySelectorAll('div.vm-wps');
    vmDivs.forEach(vmDiv => vmDiv.remove());    
    $vm.woolcock_profile_req(vm_contents,topic);
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
$vm.questions_list=function(vm_contents,param,topic){
    var p=JSON.parse(param);
    console.log(p)    
    p[1].sort();
    var questions="<div class=vm-questions>";
    var I=0;
    if(p[0]=="virtual zhiming") I=7;
    for(var i=I;i<p[1].length;i++){
        var line=p[1][i];
        if(line.length>6){
            questions+="<u class=vm-column-item topic='"+topic+"'><li>"+line+"</li></u><br>";
        }
    }
    questions+="<div>"
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer topic='"+topic+"'>"+questions+"<div>");
    var us=vm_contents.lastElementChild.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            var topic=el.parentNode.parentNode.getAttribute('topic');
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('vm_ask').value=el.textContent;
            vm_qq={};
            vm_qq[el.textContent]=topic;
            query();
        });
    });
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.login=function(vm_contents,tList,topic){
    var list=eval(tList);
    var text="";
    for(var i=0;i<list.length;i++){
        text+="<u>"+list[i]+"</u><br>"
    }
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+text+"<div>");
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
$vm.train=function(vm_contents,text,topic){
    var text="<u>"+text+"</u>"
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer>"+text+"<div>");
    var us=vm_contents.lastElementChild.querySelectorAll('u');
    us.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            train();
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
    new Tabulator(div, {
        columns:config[0],
        data:config[1], 
        layout:"fitColumns" 
    });
    document.getElementById('vm_ask').value='';
    scroll();
}
//------------------------------------------------
$vm.data_to_grid_01=function(field,header,data){
    var txt="<tr><th></th><th>ID</th>";
    header.forEach((hh)=>{
        txt+="<th>"+hh+"</th>"
    })
    txt+="<th>Submit date</th><th>Submitted by</th></tr>";
    var d="";
    data.forEach((dd)=>{
        d+="<tr><td><u>View</u></td><td>"+dd.UID+"</td>";
        field.forEach((hh)=>{
            if(hh=="UID") d+="<td>"+dd.UID+"</td>"
            else d+="<td>"+dd.Data[hh]+"</td>"
        })
        d+="<td>"+dd.Submit_date.split('T')[0] +"</td><td>"+dd.Submitted_by+"</td></tr>";
    })
    return (txt+d)
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
                        //console.log(d[i].Data)

                        var options = {
                            collapsed: true,
                            rootCollapsable: false,
                        };
                        /*
                        var data={}
                        data.abc=123;
                        data.efg=[123,236];
                        */
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