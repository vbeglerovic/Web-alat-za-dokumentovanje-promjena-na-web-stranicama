
    setTimeout(()=> {
        document.getElementById('p1').innerHTML="Ovo je novi paragraf."
      }, 25000);

      setTimeout(()=> {
        document.getElementById('h1').innerHTML="Novi naslov"
      }, 75000);

      setTimeout(()=> {
        var p2 = document.createElement("p");
        var text = document.createTextNode("Paragrafcic");
        p2.appendChild(text);
        document.getElementById('div1').appendChild(p2);
      }, 40000);

      setTimeout(()=> {
        document.getElementById('l1').innerHTML="Labelica"
        document.getElementById("p1").style.backgroundColor="orange"
      }, 20000);

      setTimeout(()=> {
        document.getElementById("l1").style.fontSize="12px"
        document.getElementById('l1').style.background="black"
        document.getElementById("l1").innerHTML="Zavrsni"
      }, 50000);

      setTimeout(()=> {
        document.getElementById('p1').remove()
        let h1 = document.createElement("h1")
        h1.innerHTML = "Etf"
        document.body.appendChild(h1)
        let h2 = document.createElement("h1")
        h2.innerHTML = "Etf2"
        document.body.appendChild(h2)
      }, 45000);
