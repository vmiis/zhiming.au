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
$vm.api_address='https://api.zhiming.au'; if(window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost') $vm.api_address='http://localhost:8001';
init();
//--------------------------------------------
