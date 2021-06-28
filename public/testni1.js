
    setTimeout(()=> {
        document.getElementById('naslov').innerHTML="Ovo je novi naslov."
      }, 25000);

    
      setTimeout(()=> {
        document.getElementById('paragraf1').style.backgroundColor = "blue"
      }, 35000);

      setTimeout(()=> {
        document.getElementById('podnaslov').remove()
      }, 20000);

      setTimeout(()=> {
        let label = document.createElement("label")
        label.innerHTML = "ovo je labela"
        document.getElementById("div1").appendChild(label)

      }, 40000);


