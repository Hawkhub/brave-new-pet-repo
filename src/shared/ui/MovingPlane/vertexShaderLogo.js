const vertexShader = `
uniform float u_time;

varying float vZ;
varying float vPattern;

// Pseudo-random function
float random(float seed) {
  return fract(sin(seed * 78.233) * 43758.5453);
}

// Smooth minimum function for better blending
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// SDF for rounded rectangle
float roundedRect(vec2 p, vec2 size, float radius) {
  vec2 d = abs(p) - size + vec2(radius);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Base wave pattern with perfect looping
  float loopDuration = 20.0;
  float loopTime = mod(u_time, loopDuration);
  float normalizedTime = loopTime / loopDuration; // 0 to 1 range
  
  // Slower pattern cycles (1.5 cycles per loop)
  float patternPhase = sin(normalizedTime * 6.28 * 1.5); // -1 to 1, completes 1.5 cycles
  
  // Modified pattern strength curve to stay at peak longer
  float patternRamp = smoothstep(0.2, 0.5, patternPhase);
  float patternFall = smoothstep(1.0, 0.5, patternPhase);
  float patternStrength = patternRamp * patternFall;
  
  // "DDM" letters pattern
  float letterPattern = 0.0;
  float inLogoArea = 0.0; // Flag to track if we're in the logo area
  
  if (patternStrength > 0.0) {
    // Randomize pattern position for each cycle
    float cycleSeed = floor(u_time / (loopDuration / 1.5));
    
    // Generate random coordinates between -0.5 and 0.5
    float randX = random(cycleSeed) - 0.5;
    float randZ = random(cycleSeed + 100.0) - 0.5;
    
    // Blend between random position and circular motion
    float positionBlend = 0.7; // 0 = fully random, 1 = fully circular motion
    vec2 center = mix(
      vec2(randX, randZ),
      vec2(sin(normalizedTime * 6.28 * 1.5) * 0.3, cos(normalizedTime * 6.28 * 1.5) * 0.3),
      positionBlend
    );
    
    // Scale and position for the letters
    float letterHeight = 0.3;
    float letterWidth = 0.2;
    float letterSpacing = 0.12;
    float totalWidth = 3.0 * letterWidth + 2.0 * letterSpacing;
    
    // Adjust coordinates relative to center
    vec2 pos = modelPosition.xz - center;
    
    // Rotate the coordinates to make letters horizontal
    float angle = atan(center.y, center.x) + 3.14159 / 2.0; // Point letters toward center
    vec2 rotPos = vec2(
      pos.x * cos(angle) - pos.y * sin(angle),
      pos.x * sin(angle) + pos.y * cos(angle)
    );
    
    // FLIP HORIZONTALLY: Negate the x-coordinate
    rotPos.x = -rotPos.x;
    
    // FLIP VERTICALLY: Negate the y-coordinate
    rotPos.y = -rotPos.y;
    
    // Define logo area - slightly larger than the letters to ensure smooth transition
    float logoRadius = length(vec2(totalWidth/2.0, letterHeight/2.0)) * 1.5;
    float distToLogo = length(rotPos);
    
    if (distToLogo < logoRadius) {
      inLogoArea = smoothstep(logoRadius, logoRadius - 0.1, distToLogo);
      
      // M (now rightmost due to flip)
      float m = 0.0;
      vec2 mPos = rotPos - vec2(letterWidth + letterSpacing, 0.0);
      
      // M keeps the same stroke width
      float mStrokeWidth = 0.03;
      
      // Left vertical bar
      float mLeft = step(-letterWidth/2.0 - mStrokeWidth, mPos.x) * step(mPos.x, -letterWidth/2.0 + mStrokeWidth);
      mLeft *= step(-letterHeight/2.0 - mStrokeWidth, mPos.y) * step(mPos.y, letterHeight/2.0 + mStrokeWidth);
      
      // Right vertical bar
      float mRight = step(letterWidth/2.0 - mStrokeWidth, mPos.x) * step(mPos.x, letterWidth/2.0 + mStrokeWidth);
      mRight *= step(-letterHeight/2.0 - mStrokeWidth, mPos.y) * step(mPos.y, letterHeight/2.0 + mStrokeWidth);
      
      // Left diagonal
      float mLeftDiag = abs(mPos.y - (mPos.x + letterWidth/2.0) * letterHeight / letterWidth);
      mLeftDiag = step(mLeftDiag, mStrokeWidth) * step(-letterWidth/2.0, mPos.x) * step(mPos.x, 0.0);
      mLeftDiag *= step(-letterHeight/2.0, mPos.y) * step(mPos.y, letterHeight/2.0);
      
      // Right diagonal
      float mRightDiag = abs(mPos.y - (-mPos.x + letterWidth/2.0) * letterHeight / letterWidth);
      mRightDiag = step(mRightDiag, mStrokeWidth) * step(0.0, mPos.x) * step(mPos.x, letterWidth/2.0);
      mRightDiag *= step(-letterHeight/2.0, mPos.y) * step(mPos.y, letterHeight/2.0);
      
      m = max(max(mLeft, mRight), max(mLeftDiag, mRightDiag));
      
      // D (middle) - HALF-CIRCLE RIGHT SIDE, SQUARE LEFT SIDE
      float d2 = 0.0;
      vec2 d2Pos = rotPos - vec2(0.0, 0.0);
      
      // Thinner stroke width for D letters
      float dStrokeWidth = 0.02;
      
      // Left vertical bar (square)
      float d2Bar = step(-letterWidth/2.0 - dStrokeWidth, d2Pos.x) * step(d2Pos.x, -letterWidth/2.0 + dStrokeWidth);
      d2Bar *= step(-letterHeight/2.0 - dStrokeWidth, d2Pos.y) * step(d2Pos.y, letterHeight/2.0 + dStrokeWidth);
      
      // Right half-circle part
      float halfCircleRadius = letterHeight/2.0;
      vec2 d2CircleCenter = vec2(-letterWidth/2.0 + dStrokeWidth, 0.0);
      
      // Only draw the right half of the circle
      float d2Circle = 0.0;
      if (d2Pos.x >= -letterWidth/2.0 + dStrokeWidth) {
        float distToCenter = length(d2Pos - d2CircleCenter);
        float outerEdge = step(distToCenter, halfCircleRadius + dStrokeWidth);
        float innerEdge = step(halfCircleRadius - dStrokeWidth, distToCenter);
        d2Circle = outerEdge * innerEdge;
      }
      
      // Combine vertical bar and half-circle
      d2 = max(d2Bar, d2Circle);
      
      // D (now leftmost due to flip) - HALF-CIRCLE RIGHT SIDE, SQUARE LEFT SIDE
      float d1 = 0.0;
      vec2 d1Pos = rotPos - vec2(-letterWidth - letterSpacing, 0.0);
      
      // Left vertical bar (square)
      float d1Bar = step(-letterWidth/2.0 - dStrokeWidth, d1Pos.x) * step(d1Pos.x, -letterWidth/2.0 + dStrokeWidth);
      d1Bar *= step(-letterHeight/2.0 - dStrokeWidth, d1Pos.y) * step(d1Pos.y, letterHeight/2.0 + dStrokeWidth);
      
      // Right half-circle part
      vec2 d1CircleCenter = vec2(-letterWidth/2.0 + dStrokeWidth, 0.0);
      
      // Only draw the right half of the circle
      float d1Circle = 0.0;
      if (d1Pos.x >= -letterWidth/2.0 + dStrokeWidth) {
        float distToCenter = length(d1Pos - d1CircleCenter);
        float outerEdge = step(distToCenter, halfCircleRadius + dStrokeWidth);
        float innerEdge = step(halfCircleRadius - dStrokeWidth, distToCenter);
        d1Circle = outerEdge * innerEdge;
      }
      
      // Combine vertical bar and half-circle
      d1 = max(d1Bar, d1Circle);
      
      // ENSURE CONSISTENT HEIGHT: Use the same multiplier for all letters
      float letterMultiplier = 0.075;
      float mHeight = m * letterMultiplier;
      float d1Height = d1 * letterMultiplier;
      float d2Height = d2 * letterMultiplier;
      
      // Combine all letters with consistent height
      letterPattern = max(max(mHeight, d1Height), d2Height);
    }
  }
  
  // Calculate the final height
  float finalHeight = 0.0;
  
  // Base wave pattern (applied everywhere except in logo area)
  float baseWave = sin(modelPosition.x * 2.5 + normalizedTime * 6.28 * 3.0) * 0.1;
  baseWave += sin(modelPosition.z * 3.0 + normalizedTime * 6.28 * 2.0) * 0.1;
  
  if (inLogoArea > 0.0) {
    // For logo area: apply a single, unified height with very gentle movement
    // The entire logo moves as one solid object
    float gentleWave = sin(normalizedTime * 6.28 * 0.5) * 0.01;
    
    // Blend between letter height and logo area height
    float blendedHeight = mix(
      gentleWave,                      // Height for non-letter areas
      letterPattern + gentleWave,      // Height for letter areas
      step(0.001, letterPattern)       // 1 if letter, 0 if not
    );
    
    // Blend between base wave and logo height based on pattern strength and logo area
    finalHeight = mix(baseWave, blendedHeight, patternStrength * inLogoArea);
  } else {
    // Outside logo area: just use the base wave
    finalHeight = baseWave;
  }
  
  modelPosition.y += finalHeight;
  
  vZ = modelPosition.y;
  vPattern = patternStrength * letterPattern * 5.0; // Pass pattern intensity to fragment shader

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

export default vertexShader