var camera, scene, renderer;
var geometry, material, mesh;

var lastMouse = new THREE.Vector2(), INTERSECTED;
var mouse = new THREE.Vector2(), INTERSECTED;
var clock = new THREE.Clock();
var orientations;

var moveQ = new THREE.Quaternion(500, 500, 500, 0.0);
var tmpQ = new THREE.Quaternion();
var currentQ = new THREE.Quaternion();

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
      252.0 / 255.0,
      243.0 / 255.0,
      210.0 / 255.0,
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
  renderer.setClearColor("#BBCF78")

  triangles.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
}


function animate() {
  requestAnimationFrame(animate);

  var deltaTime = clock.getDelta();
  var delta = new THREE.Vector2()
  delta.subVectors( mouse, lastMouse );
  tmpQ.set(moveQ.x * deltaTime * delta.x * 0.2, moveQ.y * deltaTime * delta.y * 0.2, 0, 1).normalize();

  for (var i = 0, ul = orientations.count; i < ul; i++) {
    var index = i * 4;
    currentQ.set(orientations.array[index], orientations.array[index + 1], orientations.array[index + 2], orientations.array[index + 3]);
    currentQ.multiply(tmpQ);
    orientations.setXYZW(i, currentQ.x, currentQ.y, currentQ.z, currentQ.w);
  }
  orientations.needsUpdate = true;

  lastMouse.x = mouse.x;
  lastMouse.y = mouse.y;

  render();
}

function render() {
  renderer.render(scene, camera);
}
function onDocumentMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}