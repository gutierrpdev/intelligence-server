function retrieveCSV(game){
    fetch('http://tfg.padaonegames.com/' + game + 'Data/csv', 
    {method: 'GET', mode: 'no-cors'})
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = game + "Data.csv";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
    });
}