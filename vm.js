$vm.auth_signin=function(e){var t=window.location.origin;t+="/auth.html",e.includes("Microsoft")?(url=(url="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=f39f8959-8cd7-4570-8c0f-548306bf899a&response_type=code")+"&redirect_uri="+t+"&scope=openid user.read profile&response_mode=fragment&state=exchange-microsoft-token&nonce=678910&prompt=select_account",window.open(url)):e.includes("Google")?(url="https://accounts.google.com/o/oauth2/v2/auth",url=(url+="?client_id=485153637765-maqa89r5jm9rusuc1u87sh72lrlpckk3.apps.googleusercontent.com")+"&response_type=code&redirect_uri="+t+"&scope=profile email&state=exchange-google-token",window.open(url)):e.includes("Facebook")?(url="https://graph.facebook.com/oauth/authorize",url=(url+="?client_id=596805194160323")+"&response_type=code&redirect_uri="+t+"&scope=public_profile email&state=exchange-facebook-token",window.open(url)):e.includes("GitHub")&&(url="https://github.com/login/oauth/authorize",url=(url+="?client_id=ae5ccbea07e700346cbd")+"&response_type=code&redirect_uri="+t+"&scope=user&state=exchange-github-token",window.open(url))},$vm.auth_signout=function(){sessionStorage.clear(),location.reload()},window.onmessage=function(e){var t,n,o=window.location.origin;o+="/auth.html",e.origin==window.location.origin&&(t=e.data.cmd,n=e.data.code,e=e.data.href,null!=n)&&null!=t&&$vm.request_token(t,n,o,e,function(){$vm.user_name=sessionStorage.getItem("username"),$vm.displayname=sessionStorage.getItem("displayname"),$vm.show_user()})},$vm.show_user=function(){var e;null==sessionStorage.getItem("vm_token")?(document.getElementById("vm_sign_in").style.display="inline-block",document.getElementById("vm_sign_out").style.display="none",document.getElementById("vm_sign_name").style.display="none"):(document.getElementById("vm_sign_in").style.display="none",document.getElementById("vm_sign_out").style.display="inline-block",(e=document.getElementById("vm_sign_name")).style.display="inline-block",e.innerHTML=sessionStorage.getItem("displayname"),$vm.user_name=sessionStorage.getItem("username"),$vm.displayname=sessionStorage.getItem("displayname"))},$vm.request_token=function(n,e,t,o,s){$vm.request({cmd:n,token:e,redirect_uri:t}).then(e=>{if("ok"==e.status&&null!=e.result)switch(n){case"exchange-microsoft-token":case"exchange-google-token":case"exchange-facebook-token":case"exchange-github-token":var t=JSON.parse(e.result.token.split("|")[0]);sessionStorage.setItem("username",e.result.user_name),sessionStorage.setItem("displayname",e.result.displayname),sessionStorage.setItem("group",t.groups),sessionStorage.setItem("vm_token",e.result.token),s()}}).catch(e=>{console.log(e)})},$vm.request=function(e){return new Promise((t,n)=>{fetch($vm.api_address,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(e=>e.json()).then(e=>{t(e)}).catch(e=>{n(e)})})},$vm.wiki_search=function(e){return new Promise((t,n)=>{fetch("https://en.wikipedia.org/w/api.php?action=query&srlimit=1&format=json&origin=*&list=search&srsearch="+e).then(e=>e.json()).then(e=>{t(e)}).catch(e=>{n(e)})})},$vm.wiki_title=function(e){return new Promise((t,n)=>{fetch("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exsentences=5&exintro&explaintext&redirects=1&origin=*&titles="+e).then(e=>e.json()).then(e=>{t(e)}).catch(e=>{n(e)})})},$vm.wiki_query=function(e){return new Promise((n,o)=>{$vm.wiki_search(e).then(e=>{var t;1==e.query.search.length?(t=e.query.search[0].pageid,$vm.wiki_title(e.query.search[0].title).then(e=>{n(e.query.pages[t].extract.split("\n")[0])}).catch(e=>{o(e)})):n("")}).catch(e=>{o(e)})})};