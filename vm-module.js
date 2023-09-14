//------------------------------------------------
$vm.responsive=function(a){
    var dw=a[0].contentRect.width;
    var id=a[0].target.id;
    var bp=document.getElementById(id).getAttribute("bp"); 
    if(bp==null) return;
    var bps=bp.split('|');
    var n0=10000000; if(bps.length>0) n0=parseInt(bps[0]);
    var n1=20000000; if(bps.length>1) n1=parseInt(bps[1]);
    var n2=30000000; if(bps.length>2) n2=parseInt(bps[2]);
    var n3=40000000; if(bps.length>3) n3=parseInt(bps[3]);

    var divs = document.getElementById(id).getElementsByTagName('div');
    for( i=0; i< divs.length; i++ ){
        var vmw=divs[i].getAttribute("w");
        if(vmw!=null){
            divs[i].style['float']='left';
            divs[i].style['box-sizing']='border-box';
            divs[i].parentElement.style['border-width']=0;
            divs[i].parentElement.style['box-sizing']='border-box';
            divs[i].parentElement.style['display']="flow-root";
            var ws=vmw.split('|');
            var pw=parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('width').replace('.px',''));
            var LR1=parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('padding-left').replace('.px',''))+
                    parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('padding-right').replace('.px',''))+
                    parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('border-left-width').replace('.px',''))+
                    parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('border-right-width').replace('.px',''));
            pw=pw-LR1;
            
            var nw0=576; if(ws.length>0) nw0=(pw*ws[0]/100);
            var nw1=nw0; if(ws.length>1) nw1=(pw*ws[1]/100);
            var nw2=nw1; if(ws.length>2) nw2=(pw*ws[2]/100);
            var nw3=nw2; if(ws.length>3) nw3=(pw*ws[3]/100);
            var nw4=nw3; if(ws.length>4) nw4=(pw*ws[4]/100);

            var nw=0;
            if(dw<n0)           nw=nw0;
            if(dw>=n0 && dw<n1) nw=nw1
            if(dw>=n1 && dw<n2) nw=nw2
            if(dw>=n2 && dw<n3) nw=nw3;
            if(dw>=n3)          nw=nw4;
            divs[i].style.width=nw+"px"; 
        }
    }                    
}
//------------------------------------------------
$vm.set_full_screen=function(div){
    div.addEventListener('click', (event) => {
        event.stopPropagation();
        if (event.ctrlKey) {
            if(div.style.position==""){
                div.style.position="fixed";
                div.style.top=0;
                div.style.left=0;
                div.style.padding=0;
                div.style.width="100%";
                div.style.height="100%";
                div.style.background="#242528";
                try{
                    div.style['height']=window.innerHeight+'px';
                    div.style['max-height']='unset';
                }catch(e){}
            }
            else{
                div.style.position='';
                try{
                    div.style['max-height']='600px';
                    div.style['height']='unset';
                }catch(e){}
                //--------------------------
                vm_scroll.scrollTop =div.offsetTop -vm_scroll.offsetTop ;
                //--------------------------

            }
        }
    })
}
//------------------------------------------------
$vm.module=function(vm_contents,A){
    var data=JSON.parse(A);
    var div="";
    if(data.id==0){
        var module="";
        var question=data.question;
        var local_mdt=localStorage.getItem("module_"+question+"_mdt");
        if(local_mdt!=undefined && local_mdt==data.mdt){
            module=localStorage.getItem("module_"+question);
        }
        else if(data.module!=undefined){
            localStorage.setItem("module_"+question+"_mdt",data.mdt);
            localStorage.setItem("module_"+question,data.module);
            module=data.module;
        }
        if(module!=undefined && module!=""){
            data.id=$vm._id++;
            if($vm.g_object[data.id]==undefined){ $vm.g_object[data.id]={data:data}; }
            vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-question >"+data.question+"</div>")
            vm_contents.insertAdjacentHTML('beforeend',"<div class=vm-answer><div id="+data.id+"></div>");
            div=vm_contents.lastElementChild.querySelector('div');
            var txt=module.replace(/_vmID/g, data.id).replace(/_vmQUESTION/g,data.question);
            div.innerHTML=txt;
            var script=div.querySelectorAll('script');
            script.forEach(s=>{
                eval(s.innerHTML);
            })
            $vm.set_full_screen(vm_contents.lastElementChild);
        }
        else{
            var d={cmd:"module"}
            var q=data.question+"|"+JSON.stringify(d);
            $vm.query(q);
        }
    }
    else{
        div=document.getElementById(data.id);
    }
    //--------------------------
    if(div!=""){
        $vm.g_object[data.id].data=data;
        if($vm.g_object[data.id].response!=undefined) $vm.g_object[data.id].response(data);
        vm_scroll.scrollTop =div.offsetTop -vm_scroll.offsetTop ;
    }
};
//------------------------------------------------
$vm.module_data_to_grid_search_page=function(data){
    var a_fields=data.fields;
    var field=[];   a_fields.split(',').forEach((item,i)=>{field.push(item.split('|')[0])});
    var header=[];  a_fields.split(',').forEach((item,i)=>{header.push(item.split('|').pop())});
    var formats=data.formats;
    var txt="<tr>";
    header.forEach((hh)=>{
        txt+="<th>"+hh.trim()+"</th>"
    })
    txt+="</tr>";
    var d="";
    data.rows.forEach((dd,i)=>{
        d+="<tr>";
        field.forEach((hh)=>{
            hh=hh.trim();
            var v=dd[hh]; if(v==undefined) v="";
            if(hh=="_edit") v="<u i="+i+" t=edit d="+dd["_id"]+">Edit</u>"
            if(hh=="_delete") v="<u i="+i+" t=delete d="+dd["_id"]+" uid="+dd["_UID"]+" >Delete</u>"
            d+="<td>"+v+"</td>"
        })
        d+="</tr>"
    })
    return (txt+d)
}
//------------------------------------------------
$vm.module_data_action=function(m_id,table){
    var us=table.querySelectorAll('u');
    us.forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            var i=el.getAttribute("i")
            var t=el.getAttribute("t")
            var d=el.getAttribute("d")
            var u=el.getAttribute("uid")
            if(t=="edit"){
                var data=$vm.g_object[m_id].data;
                var record=data.rows[i];
                /*
                var F=document.getElementById("vm_F_"+m_id);
                F.reset();
                $vm.deserialize(record,F)
                var fm=document.getElementById("vm_form_"+m_id);
                fm.setAttribute('_id',d);
                fm.style.top="10px";
                */
                $vm.g_object[m_id].open_form_with_data(d,record);
            }
            if(t=="delete"){
                const userConfirmed = window.confirm('Are you sure you want to delete the record (ID='+u+')?');
                if (userConfirmed) {
                    $vm.g_object[m_id].delete_request(d);
                } 
                else {
                }                
            }
        });
    });
}
//------------------------------------------------
$vm.form_field_names=function(fm,fn){
    if(fn!=3) fn=1000;
    var controlNames = [];
    // Loop through form controls and store their names
    for (var i = 0; i < fm.elements.length && i<fn; i++) {
        var element = fm.elements[i];
        if (element.name) {
            if(controlNames.indexOf(element.name)==-1){
                controlNames.push(element.name);
            }
        }
    }
    return controlNames.join(',');
}
//------------------------------------------------
$vm.serialize=function(form){
    const formData = new FormData(form);
    const formValues = {}; formData.forEach((value, key) => { formValues[key] = value; });
    return formValues;
}
//------------------------------------------------
$vm.deserialize=function(record,form){
	if(record==undefined) return;
	for(p in record){
        var value=record[p];
        var el=form.elements[p];
        //console.log(p+"  "+record[p]);
        //console.log(form.elements[p].type);
        var type=""; if(el!=undefined) type=el.type;
        //console.log(type)
        switch(type){
            case 'checkbox':
                if(value=='off' || value=='0' || value=='' || value==undefined ) el.checked=false;
                else el.checked=true;
                break;
            case 'radio':
                if(el.getAttribute('value')==value){
                    el.checked=true; 
                }
                break;
            
            case 'file':
                break;
            case 'text':
            case 'email':
            case 'date':
            case 'time':
            case 'tel':
            case 'textarea':
            case 'select-one':
                el.value=value;
                break;
            default:
                if(el!=undefined){
                    if (el instanceof RadioNodeList){ 
                        for(var i=0;i<el.length;i++){
                            var a=el[i];
                            var ttp=a.type;
                            //console.log(ttp)
                            if(ttp=='radio'){ 
                                if(a.getAttribute('value')==value){
                                    a.checked=true; 
                                }                            
                            }
                        }
                    }
                    else{
                        var type1=el.getAttribute('nodeName');
                        console.log(type1)
                        switch(type1){
                            //case "SELECT":
                                //$vm.add_value_to_select($el,value);
                                //$el.val(value);
                                //break;
                            //case "TEXTAREA":
                                //$el.val(value); 
                                //break;
                            default: 
                                console.log(type+"---"+type1)				
                                //$el.val(value); 
                        }
                    }
                }
                break;
        }
    /*
    $.each(record, function(name, value){
		if(name!=''){
			var $els = $(form_id+' *[name='+name+']');
			$els.each(function(){
				var $el=$(this);
				var type = $el.attr('type');
				switch(type){
					case 'checkbox':
						if(value=='off' || value=='0' || value=='' || value==undefined ) $el.prop('checked', false);
						else $el.prop('checked', true);
						break;
					case 'radio':
						if($el.attr('value')==value){
							$el.prop('checked', true);
						}
						break;
					case 'file':
						break;
					case 'text':
					case 'email':
					case 'date':
					case 'time':
					case 'tel':
					case 'textarea':
					case 'select':
						$el.val(value);
						break;
					case 'undefined':
						break;
					default:
						var type1=$(this).prop('nodeName');
						switch(type1){
							case "SELECT":
								$vm.add_value_to_select($el,value);
								$el.val(value);
								break;
							case "TEXTAREA":
                                $el.val(value); 
                                break;
							default: 
								console.log(type+"---"+type1)				
                                $el.val(value); 
                                break;
						}
						break;
				}
			});
		}
	});
    */
    }
}
//------------------------------------------------
