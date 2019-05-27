var camera, scene, renderer;
var geometry, material, mesh;

var lastMouse = new THREE.Vector2(), INTERSECTED;
var mouse = new THREE.Vector2(), INTERSECTED;
var orientations;

init();
animate();

function init() {


  camera = new THREE.OrthographicCamera(-.5, .5, -.5, .5, 1, 5);
  camera.position.z = 2;

  scene = new THREE.Scene();
  var triangles = 1;
  var instances = 1000;
  var geometry = new THREE.InstancedBufferGeometry();
  geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise

  var vertices = new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3);
  vertices.setXYZ(0, 0.025 * ( 1 + Math.random() * 3 ), -0.025 * ( 1 + Math.random() * 3 ), 0);
  vertices.setXYZ(1, -0.025 * ( 1 + Math.random() * 3 ), 0.025 * ( 1 + Math.random() * 3 ), 0);
  vertices.setXYZ(2, 0, 0, 0.025 * ( 1 + Math.random() * 3 ) );
  geometry.addAttribute('position', vertices);

  var offsets = new THREE.InstancedBufferAttribute(new Float32Array(instances * 3), 3, 1);
  for (var i = 0, ul = offsets.count; i < ul; i++) {
    offsets.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, 0);
  }
  geometry.addAttribute('offset', offsets);

  var colors = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
  for (var i = 0, ul = colors.count; i < ul; i++) {
    colors.setXYZW(i,
      0.73,
      0.81,
      0.47,
      0.3 + 0.5 * Math.random()
    );
  }
  geometry.addAttribute('color', colors);


  var vector = new THREE.Vector4();
  orientations = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
  for (var i = 0, ul = orientations.count; i < ul; i++) {
    vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    vector.normalize();
    orientations.setXYZW(i, vector.x, vector.y, vector.z, vector.w);
  }
  geometry.addAttribute('orientation', orientations);

  var material = new THREE.RawShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      sineTime: { value: 1.0 }
    },
    vertexShader: eddieInstanceVert,
    fragmentShader: eddieInstanceFrag,
    wireframe: true,
    side: THREE.DoubleSide,
    transparent: true
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  triangles = document.getElementById("triangles");
  renderer = new THREE.WebGLRenderer();
  renderer.setSize($(triangles).width(), $(triangles).height());
  renderer.setClearColor("#FCF3D2")

  triangles.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

var moveQ = (new THREE.Quaternion(.5, .5, .5, 0.0)).normalize();
var tmpQ = new THREE.Quaternion();
var currentQ = new THREE.Quaternion();
function onDocumentMouseMove(event) {
  event.preventDefault();

  lastMouse.x = mouse.x;
  lastMouse.y = mouse.y;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  var delta = mouse.sub(lastMouse);
  //console.log(delta);
  tmpQ.set(moveQ.x * delta.x * 0.2, moveQ.y * delta.y * 0.2, 0, 1).normalize();

  for (var i = 0, ul = orientations.count; i < ul; i++) {
    var index = i * 4;
    currentQ.set(orientations.array[index], orientations.array[index + 1], orientations.array[index + 2], orientations.array[index + 3]);
    currentQ.multiply(tmpQ);
    orientations.setXYZW(i, currentQ.x, currentQ.y, currentQ.z, currentQ.w);
  }
  orientations.needsUpdate = true;
}