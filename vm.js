$vm.request=function(req){
    return new Promise((resolve, reject) => {
        fetch($vm.api_address,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)                        
        })
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })
}
