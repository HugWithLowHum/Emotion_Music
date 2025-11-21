//window.alert(`This is an alert!`);
let x_coord;
let y_coord;
document.getElementById('coords_submit').onclick = function(){
    x_coord = document.getElementById('x_input').value;
    y_coord = document.getElementById('y_input').value;
    x_coord = Number(x_coord);
    y_coord = Number(y_coord);
    console.log(`The emotion coordinates are: (${x_coord}, ${y_coord})`)
    document.getElementById('current_coords_out').textContent = `Your current emotion coordinates are: (${x_coord}, ${y_coord})`;
    console.log(typeof x_coord, typeof y_coord);
}