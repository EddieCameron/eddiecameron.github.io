var eddieInstanceVert = `
		precision highp float;
		uniform float sineTime;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec3 angleOffset;
		attribute vec4 color;
		attribute vec4 orientation;
		varying vec3 vPosition;
		varying vec4 vColor;
    
		void main(){			
            vec3 vPosition = position;
			vec3 vcV = cross(orientation.xyz, vPosition);
			vPosition = vcV * (2.0 * orientation.w) + (cross(orientation.xyz, vcV) * 2.0 + vPosition);
      
			vColor = color;
			vPosition = offset + vPosition;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
		}
		`;