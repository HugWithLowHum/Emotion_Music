//window.alert(`This is an alert!`);
const dot = document.getElementById('dot');
const output = document.getElementById('currentCoordsOut');
coordsSystem.addEventListener('click', function(e){
    //e for "event", i.e. click event.
    const rect = coordsSystem.getBoundingClientRect();
    //x and y are coords relative to the image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    //The intuitive (0,0), which is the center of the image, relative to the image
    const center_y = (rect.bottom-rect.top)/2;
    const center_x = (rect.right-rect.left)/2;
    //intuitive_x and intuitive_y are the intuitive coords with intuitive (0,0)
    const intuitive_x = Number(((x - center_x)/5).toFixed(2));
    const intuitive_y = Number((-(y - center_y)/5).toFixed(2));
    // Show the dot on the image
    dot.style.left =`${x}px`; 
    dot.style.top = `${y}px`;
    dot.style.display = "block";
    // Display the coordinates
    output.textContent = `Your current emotion coordinates are: (${intuitive_x}, ${intuitive_y})`;
})