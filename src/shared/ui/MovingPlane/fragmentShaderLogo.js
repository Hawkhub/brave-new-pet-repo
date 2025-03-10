const fragmentShader = `
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_patternColor;
varying float vZ;
varying float vPattern;

void main() {
  // Base color from height
  vec3 baseColor = mix(u_colorA, u_colorB, vZ * 2.0 + 0.5);
  
  // For the pattern/logo, use the same color transition logic as the waves
  // but push it toward the hotter color (u_colorB) at its peak
  float heightIntensity = clamp(vPattern * 2.0, 0.0, 1.0);
  vec3 patternColor = mix(baseColor, u_colorB, heightIntensity);
  
  // Blend between base wave color and pattern color based on pattern intensity
  vec3 finalColor = mix(baseColor, patternColor, clamp(vPattern, 0.0, 1.0));
  
  gl_FragColor = vec4(finalColor, 1.0);
}

`

export default fragmentShader
