var eddieInstanceFrag = `
	precision highp float;
	varying vec4 vColor;
	void main() {
		gl_FragColor = vec4( vColor );
	}`