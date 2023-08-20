$vm.data_to_grid_vm=function(data,fn){
    var a_fields=data.fields;
    if(fn==3 || fn==100){
        var all=[];
        data.rows.forEach((dd)=>{
            for(p in dd){
                if(all.indexOf(p)==-1 && data.fields.indexOf(p)==-1) all.push(p);
            }
        })
        var n_all=all;
        if(fn==3) n_all=[all[0],all[1],all[2]];    
        var af=n_all.join(',');
        a_fields=data.fields.replace('_all_',af);
    }   
    var field=[];   a_fields.split(',').forEach((item,i)=>{field.push(item.split('|')[0])});
    var header=[];  a_fields.split(',').forEach((item,i)=>{header.push(item.split('|').pop())});
    
    var txt="<tr><th></th>";
    header.forEach((hh)=>{
        txt+="<th>"+hh+"</th>"
    })
    txt+="</tr>";
    var d="";
    data.rows.forEach((dd)=>{
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
$vm.data_to_grid_vm_u_view=function(div,data){
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
                value: data.rows[i],
                theme:'light',
                displayDataTypes:false,
                maxDisplayLength:100,
                collapseStringsAfterLength:100
            }).render('#vm_json_renderer')
            $vm.open_popup();
        });
    });
}
//------------------------------------------------
$vm.data_to_grid_vm_b_click_data={};
$vm.data_to_grid_vm_b_click=function(div){
    var el=div.querySelectorAll('button')[1];
    el.addEventListener('click', (e) => { 
        e.preventDefault(); e.stopPropagation(); 
        var divid=div.getAttribute('id');
        var data=$vm.data_to_grid_vm_b_click_data[divid];
        var fn=el.getAttribute('fn');
        if(fn=="3"){ el.setAttribute('fn','100');     }
        if(fn=="100"){ el.setAttribute('fn','3');    }
        var table=div.querySelector('table')
        table.innerHTML=$vm.data_to_grid_vm(data,fn);
        $vm.data_to_grid_vm_u_view(div,data);
    });
}
//------------------------------------------------
$vm.grid_render_vm=function(data){
    var div;
    var btn_all="<button style='display:none'></button>";
    var btn_download="<button style='margin-left:6px'>Download</button>";
    var fn=0;
    var fall=data.fields.indexOf('_all_');
    if(fall!=-1) btn_all="<button fn=100 style='margin-left:20px'>3/all</button>";
    if(data.btn=="0"){
        btn_all="<button style='display:none'></button>";
        btn_download="<button style='display:none'></button>";
    }
    if(data.id==0){
        if(fall!=-1) fn=3;
        vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question >"+data.question+"<div>")
        vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div style='overflow:auto' class=vm-grid id="+$vm._id+++"></div><div>");
        div=vm_contents.lastElementChild.querySelector('div');
        var bar="<div style='white-space: nowrap;'><input placeholder='"+data.info_for_search+"' style='width:180px; border:1px solid #666; height:20px; padding-left:6px' /> <button>Searh</button> <label style='margin-left:30px'></label>"+btn_all+btn_download+"</div>";
        if(data.error==undefined) div.innerHTML=bar+"<table>"+$vm.data_to_grid_vm(data,fn)+"</table>";
        else div.innerHTML=bar+"<table>"+data.error+"</table>";
        
        div.querySelectorAll('button')[0].addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); qq(); });
        div.querySelector('input').addEventListener("keyup", function(e){ if (e.keyCode === 13) {  qq();  }  })
        div.querySelectorAll('button')[2].addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); 
            var dd=data.question;
            dd+="|"+inputE.value+"|0|download";
            document.getElementById('vm_ask').value=dd;
            query();
        });

        if(fall!=-1){
            $vm.data_to_grid_vm_b_click(div);
        }
    }
    else{
        div=document.getElementById(data.id);
        if(fall!=-1){
            var el=div.querySelectorAll('button')[1];
            fn=el.getAttribute('fn');
            if(fn=='3') fn='100'; else fn='3';
        }
        var table=div.querySelector('table')
        if(data.error==undefined) table.innerHTML=$vm.data_to_grid_vm(data,fn);
        else table.innerHTML=data.error;
    }
    $vm.data_to_grid_vm_u_view(div,data);

    var divid=div.getAttribute('id');
    $vm.data_to_grid_vm_b_click_data[divid]=data;


    var inputE=div.querySelector('input');
    div.querySelector('label').innerText=data.label;
    var qq=function(){
        var dd=data.question;
        var d_id=div.getAttribute('id');
        dd+="|"+inputE.value+"|"+d_id;
        document.getElementById('vm_ask').value=dd;
        query();
    }
    document.getElementById('vm_ask').value='';
    if(data.id==0) scroll();
};
//------------------------------------------------
$vm.grid_vm=function(vm_contents,A,q){
    var data=JSON.parse(A);
    if(data.download=="download"){
        $vm.download_csv(data.table,data.rows);
        alert(data.table+"("+data.rows.length +")")
        return; 
    }
//console.log(data);    
    $vm.grid_render_vm(data);
}
//------------------------------------------------
$vm.download_csv=function(fn,data){
    var CSV='';
    var row="";
    var ids=[];
    for(var i=0;i<data.length;i++){
        if(i==0){
            for(k in data[i]){
                ids.push(k);
                if(row!="") row+=",";
                row+='"'+k+'"';
            }
            row+="\r\n";
            CSV+=row;
        }
        row="";
        for(j=0;j<ids.length;j++){
            if(j!==0) row+=",";
            var v="";
            var id=ids[j];
            if(data[i][id]!==undefined) v=data[i][id];
            if(v!=null) v=v.toString().replace(/"/g,''); //remove "  ???
            row+='"'+v+'"';
        }
        row+="\r\n";
        CSV+=row;
    }
    //-----------------------
    var bytes = [];
        bytes.push(239);
        bytes.push(187);
        bytes.push(191);
    for (var i = 0; i < CSV.length; i++) {
        if(CSV.charCodeAt(i)<128) {
            bytes.push(CSV.charCodeAt(i));
        }
        else if(CSV.charCodeAt(i)<2048) {
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 1792)>>6 ) +192); //xC0>>6 + x700>>8 +xE0
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
        else if(CSV.charCodeAt(i)<65536) {
            bytes.push(((CSV.charCodeAt(i) & 61440) >>12) + 224 ); //xF00>>12 + xE0
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 3840)>>6 ) +128); //xC0>>6 + xF00>>8 +x80
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
    }
    var u8 = new Uint8Array(bytes);
    var blob = new Blob([u8]);
    //-----------------------
    if (navigator.appVersion.toString().indexOf('.NET') > 0){
        window.navigator.msSaveBlob(blob, name);
    }
    else{
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", name);
        link.style = "visibility:hidden";
        link.download = fn;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
//---------------------------------------------
