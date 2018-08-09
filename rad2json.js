// parse radiance files and return a JSON object
function rad_parser(event) {
  if (!event) return;
  // parse file
  // console.log('parsing input file.')
  const input = event.target;

  if ('files' in input && input.files.length > 0) {
    let file = input.files[0];
    read_file_content(file).then(content => {
      // Return JSON object
      let data = rad_to_json(content);
      // console.log('returning JSON objects.');
      place_file_content(data);
    }).catch(error => console.log(error))
  }

}

function read_file_content(file) {
  /* read content of a text file. */
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  })
}

function rad_to_json(rad_text) {
  /* Input multi-line radiance file and return them as an array of JSON objects. */
  const parse_rad_re = /^\s*([^0-9].*(\s*[\d.-]+.*)*)/gm;
  // separate input radiance objects
  var raw_objects = rad_text.match(parse_rad_re)
    .filter(word => word.trim().length > 0 && !word.trim().startsWith('#'));
  var json_array = raw_objects.map(line => rad_object_to_json(line));
  return json_array;
}

function rad_object_to_json(rad_text){
  /* convert a single radiance object to a JSON object */
  const rep_new_line_re = /\s\s+/g;
  const data = rad_text.replace(rep_new_line_re, " ").trim().split(" ");
  const type = data[1];
  if (!type) return;
  if (type != 'polygon') {
    console.log( rad_text  + ' is not currently supported!');
  } else {
    // for now we only support polygons
    return parse_polygon(data);
  }
}

function parse_polygon(data) {
  /* convert a polygon line to a JSON object */
  // separate x, y, z coordinates
  const pt_list = data.slice(6);

  // put every 3 item in a separate array
  var vertices = [];
  while (pt_list.length > 0)
      vertices.push(pt_list.splice(0, 3));

  const polygon = {
    'modifier': data[0],
    'type': data[1],
    'name': data[2],
    'vertices': vertices
  };
  return polygon;
}

function place_file_content(data) {
  /* place content in text box */
  let target = document.getElementById('content-target');
  let content = data.map(obj => JSON.stringify(obj, undefined, 2));
  target.value = content;
}

export { rad_parser };
