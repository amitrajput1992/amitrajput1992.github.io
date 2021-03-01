export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = vec2( uv.x, uv.y );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

export const fragmentShader = `
  uniform float mixRatio;
  uniform sampler2D tDiffuse1;
  uniform sampler2D tDiffuse2;
  uniform sampler2D tMixTexture;
  uniform int useTexture;
  uniform float threshold;
  varying vec2 vUv;
  void main() {
    vec4 texel1 = texture2D( tDiffuse1, vUv );
    vec4 texel2 = texture2D( tDiffuse2, vUv );
    if (useTexture==1) {
      vec4 transitionTexel = texture2D( tMixTexture, vUv );
      float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
      float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);
      gl_FragColor = mix( texel1, texel2, mixf );
    } else {
      gl_FragColor = mix( texel2, texel1, mixRatio );
    }
  }
`;

export const fragmentShader1 = `
  varying vec2 vUv;
  uniform sampler2D tex;
  uniform sampler2D tex2;
  uniform sampler2D disp;
  uniform float _rot;
  uniform float dispFactor;
  uniform float effectFactor;

   vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
   }

  void main() {

    vec2 uv = vUv;

    vec4 disp = texture2D(disp, uv);

    vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
    vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);

    vec4 _texture = texture2D(tex, distortedPosition);
    vec4 _texture2 = texture2D(tex, distortedPosition2);

    vec4 finalTexture = mix(_texture, _texture2, dispFactor);

    gl_FragColor = finalTexture;
  }
`;