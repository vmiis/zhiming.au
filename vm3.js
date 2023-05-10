//--------------------------------------------
$vm.div_test=function(div){
    eval(
        `
        var tabledata = [
            {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
            {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
            {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
            {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
            {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
        ];
    var table = new Tabulator(div, {
            data:tabledata, 
            layout:"fitColumns", 
            columns:[ 
                {title:"Name", field:"name"},
                {title:"Age", field:"age"},
                {title:"Favourite Color", field:"col"},
                {title:"Date Of Birth", field:"dob"},
            ],
    });
    `
   );
}
//--------------------------------------------
$vm.div_render=function(div){
    var vm=div.getAttribute('vm');
    console.log("--------------")
    console.log(vm)
    switch(vm){
        case "chart": eval(div.innerHTML); break;
        case "table": eval(div.innerHTML); break;
        case "web":   $vm.div_web(div); break; 
    }
}
//--------------------------------------------
$vm.get_text=function(txt,s1,s2){
    var i1=txt.indexOf(s1);
    var txt2=txt.substring(i1+s1.length);
    var i2=txt2.indexOf(s2);
    var txt3=txt2.substring(0,i2);
    return txt3;
}
//--------------------------------------------
$vm.div_web=function(vm_contents,code,topic){
    var answer="<div class=vm-answer-div><web>";
    vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer topic='"+topic+"'>"+answer+"<div>");
    var div=vm_contents.lastElementChild.querySelector('div');
    var json=JSON.parse(code);
    //console.log(json);  
    var url=json.url;
    var text="";
    fetch(url)
    .then(response => response.text())
    .then(c=>{
        var sl=json.pos.length;
        var s1=json.pos[0];
        var s2=json.pos[1];
        var txt=$vm.get_text(c,s1,s2);
        //console.log(txt);
        for(var i=2;i<sl;i++){
            if(json.pos[i]!=undefined){
                var s1=json.pos[i][0];
                var s2=json.pos[i][1];
                var txt2=$vm.get_text(txt,s1,s2);
                var si=txt.indexOf(txt2);
                txt=txt.substring(si+txt2.length+4);
                //console.log(txt);
                //console.log(txt2);
                text+="<p>"+txt2+"</p>";
            }
        }
        //console.log(text);
        div.innerHTML=text;
        scroll();
    })
    .catch(e=>{
    });
}
//--------------------------------------------
$vm.div_test=function(div){
}
//--------------------------------------------
$vm.api_address='https://api.zhiming.au'; if(window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost') $vm.api_address='http://localhost:8001';
init();
//--------------------------------------------
