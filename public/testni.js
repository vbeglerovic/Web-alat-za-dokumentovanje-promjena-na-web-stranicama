
    setTimeout(()=> {
        document.getElementById('p1').innerHTML="Ovo je novi paragraf."
      }, 25000);

      setTimeout(()=> {
        document.getElementById('h1').innerHTML="Novi naslov"
      }, 75000);

      setTimeout(()=> {
        var p2 = document.createElement("p");
        var text = document.createTextNode("Paragraf dva");
        p2.appendChild(text);
        document.getElementById('div1').appendChild(p2);
      }, 40000);

      setTimeout(()=> {
        document.getElementById('l1').innerHTML="Nova labela"
      }, 35000);
