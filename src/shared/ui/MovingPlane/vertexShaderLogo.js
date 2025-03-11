const vertexShader = `
uniform float u_time;

varying float vZ;
varying float vPattern;
varying float vShine; // Varying for the shine effect

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

// Function to calculate base wave height at any position
float calculateBaseWaveHeight(vec2 pos, float normalizedTime) {
  float baseWave = sin(pos.x * 2.5 + normalizedTime * 6.28 * 3.0) * 0.1;
  baseWave += sin(pos.y * 3.0 + normalizedTime * 6.28 * 2.0) * 0.1;
  return baseWave;
}

// Function to create a single logo instance
float createLogo(vec2 pos, vec2 center, float normalizedTime, float patternStrength, float cycleSeed, out float shine, out float inLogoArea, out float localWaveHeight) {
  // Scale and position for the letters
  float letterHeight = 0.3;
  float letterWidth = 0.2;
  float letterSpacing = 0.12;
  float totalWidth = 3.0 * letterWidth + 2.0 * letterSpacing;
  
  // Adjust coordinates relative to center
  vec2 adjustedPos = pos - center;
  
  // Rotate the coordinates to make letters horizontal
  float angle = atan(center.y, center.x) + 3.14159 / 2.0; // Point letters toward center
  vec2 rotPos = vec2(
    adjustedPos.x * cos(angle) - adjustedPos.y * sin(angle),
    adjustedPos.x * sin(angle) + adjustedPos.y * cos(angle)
  );
  
  // FLIP HORIZONTALLY: Negate the x-coordinate
  rotPos.x = -rotPos.x;
  
  // FLIP VERTICALLY: Negate the y-coordinate
  rotPos.y = -rotPos.y;
  
  // Define logo area - slightly larger than the letters to ensure smooth transition
  float logoRadius = length(vec2(totalWidth/2.0, letterHeight/2.0)) * 1.5;
  float distToLogo = length(rotPos);
  
  // Calculate the local wave height at this position - EXACT SAME CALCULATION AS BASE WAVE
  localWaveHeight = calculateBaseWaveHeight(pos, normalizedTime);
  
  inLogoArea = 0.0; // Initialize logo area flag
  float letterPattern = 0.0;
  shine = 0.0; // Initialize shine value
  
  if (distToLogo < logoRadius) {
    // Define edge softness parameters
    float edgeSoftness = 0.015; // Controls the width of the soft edge transition
    float baseSoftness = 0.008; // Base softness for inner parts of letters
    
    // M (now rightmost due to flip)
    float m = 0.0;
    float mShine = 0.0; // Shine for M
    vec2 mPos = rotPos - vec2(letterWidth + letterSpacing, 0.0);
    
    // M keeps the same stroke width
    float mStrokeWidth = 0.03;
    
    // Left vertical bar - using distance fields for smoother edges
    float leftDist = abs(mPos.x + letterWidth/2.0) - mStrokeWidth;
    float leftVert = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, leftDist);
    leftVert *= smoothstep(-letterHeight/2.0 - mStrokeWidth - edgeSoftness, -letterHeight/2.0 - mStrokeWidth + baseSoftness, mPos.y) * 
                smoothstep(letterHeight/2.0 + mStrokeWidth + edgeSoftness, letterHeight/2.0 + mStrokeWidth - baseSoftness, mPos.y);
    
    // Right vertical bar - using distance fields for smoother edges
    float rightDist = abs(mPos.x - letterWidth/2.0) - mStrokeWidth;
    float rightVert = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, rightDist);
    rightVert *= smoothstep(-letterHeight/2.0 - mStrokeWidth - edgeSoftness, -letterHeight/2.0 - mStrokeWidth + baseSoftness, mPos.y) * 
                 smoothstep(letterHeight/2.0 + mStrokeWidth + edgeSoftness, letterHeight/2.0 + mStrokeWidth - baseSoftness, mPos.y);
    
    // Left diagonal - using distance to line for smoother edges
    float mLeftDiagDist = abs(mPos.y - (mPos.x + letterWidth/2.0) * letterHeight / letterWidth) - mStrokeWidth;
    float mLeftDiag = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, mLeftDiagDist);
    mLeftDiag *= smoothstep(-letterWidth/2.0 - edgeSoftness, -letterWidth/2.0 + baseSoftness, mPos.x) * 
                 smoothstep(0.0 + edgeSoftness, 0.0 - baseSoftness, mPos.x);
    mLeftDiag *= smoothstep(-letterHeight/2.0 - edgeSoftness, -letterHeight/2.0 + baseSoftness, mPos.y) * 
                 smoothstep(letterHeight/2.0 + edgeSoftness, letterHeight/2.0 - baseSoftness, mPos.y);
    
    // Right diagonal - using distance to line for smoother edges
    float mRightDiagDist = abs(mPos.y - (-mPos.x + letterWidth/2.0) * letterHeight / letterWidth) - mStrokeWidth;
    float mRightDiag = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, mRightDiagDist);
    mRightDiag *= smoothstep(0.0 - edgeSoftness, 0.0 + baseSoftness, mPos.x) * 
                  smoothstep(letterWidth/2.0 + edgeSoftness, letterWidth/2.0 - baseSoftness, mPos.x);
    mRightDiag *= smoothstep(-letterHeight/2.0 - edgeSoftness, -letterHeight/2.0 + baseSoftness, mPos.y) * 
                  smoothstep(letterHeight/2.0 + edgeSoftness, letterHeight/2.0 - baseSoftness, mPos.y);
    
    // Combine all parts of M with smooth max
    m = max(max(leftVert, rightVert), max(mLeftDiag, mRightDiag));
    
    // Calculate shine for M - detect edges with softer transition
    float mEdgeFactor = 0.03;
    float mLeftEdge = smoothstep(mEdgeFactor, 0.0, abs(abs(mPos.x + letterWidth/2.0) - mStrokeWidth));
    float mRightEdge = smoothstep(mEdgeFactor, 0.0, abs(abs(mPos.x - letterWidth/2.0) - mStrokeWidth));
    float mTopEdge = smoothstep(mEdgeFactor, 0.0, abs(abs(mPos.y - letterHeight/2.0) - mStrokeWidth));
    float mBottomEdge = smoothstep(mEdgeFactor, 0.0, abs(abs(mPos.y + letterHeight/2.0) - mStrokeWidth));
    float mDiagEdge = max(
      smoothstep(mEdgeFactor, 0.0, abs(abs(mPos.y - (mPos.x + letterWidth/2.0) * letterHeight / letterWidth) - mStrokeWidth)),
      smoothstep(mEdgeFactor, 0.0, abs(abs(mPos.y - (-mPos.x + letterWidth/2.0) * letterHeight / letterWidth) - mStrokeWidth))
    );
    
    mShine = max(max(max(mLeftEdge, mRightEdge), max(mTopEdge, mBottomEdge)), mDiagEdge) * m;
    
    // D (middle) - HALF-CIRCLE RIGHT SIDE, SQUARE LEFT SIDE
    float d2 = 0.0;
    float d2Shine = 0.0; // Shine for D2
    vec2 d2Pos = rotPos - vec2(0.0, 0.0);
    
    // Thinner stroke width for D letters
    float dStrokeWidth = 0.02;
    
    // Left vertical bar (square) - with softer edges
    float d2BarDist = abs(d2Pos.x + letterWidth/2.0) - dStrokeWidth;
    float d2Bar = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, d2BarDist);
    d2Bar *= smoothstep(-letterHeight/2.0 - dStrokeWidth - edgeSoftness, -letterHeight/2.0 - dStrokeWidth + baseSoftness, d2Pos.y) * 
             smoothstep(letterHeight/2.0 + dStrokeWidth + edgeSoftness, letterHeight/2.0 + dStrokeWidth - baseSoftness, d2Pos.y);
    
    // Right half-circle part - with softer edges
    float halfCircleRadius = letterHeight/2.0;
    vec2 d2CircleCenter = vec2(-letterWidth/2.0 + dStrokeWidth, 0.0);
    
    // Only draw the right half of the circle with softer edges
    float d2Circle = 0.0;
    if (d2Pos.x >= -letterWidth/2.0 + dStrokeWidth - edgeSoftness) {
      float distToCenter = length(d2Pos - d2CircleCenter);
      float outerEdge = smoothstep(halfCircleRadius + dStrokeWidth + edgeSoftness, halfCircleRadius + dStrokeWidth - baseSoftness, distToCenter);
      float innerEdge = smoothstep(halfCircleRadius - dStrokeWidth - edgeSoftness, halfCircleRadius - dStrokeWidth + baseSoftness, distToCenter);
      d2Circle = outerEdge * innerEdge;
    }
    
    // Combine vertical bar and half-circle with smooth max
    d2 = max(d2Bar, d2Circle);
    
    // Calculate shine for D2 with softer edges
    float d2EdgeFactor = 0.03;
    float d2LeftEdge = smoothstep(d2EdgeFactor, 0.0, abs(abs(d2Pos.x + letterWidth/2.0) - dStrokeWidth));
    float d2TopBottomEdge = max(
      smoothstep(d2EdgeFactor, 0.0, abs(abs(d2Pos.y - letterHeight/2.0) - dStrokeWidth)),
      smoothstep(d2EdgeFactor, 0.0, abs(abs(d2Pos.y + letterHeight/2.0) - dStrokeWidth))
    );
    
    // Circle edge detection with softer transition
    float d2CircleEdge = 1.0;
    if (d2Pos.x >= -letterWidth/2.0 + dStrokeWidth - edgeSoftness) {
      float distToCenter = length(d2Pos - d2CircleCenter);
      d2CircleEdge = max(
        smoothstep(d2EdgeFactor, 0.0, abs(distToCenter - (halfCircleRadius + dStrokeWidth))),
        smoothstep(d2EdgeFactor, 0.0, abs(distToCenter - (halfCircleRadius - dStrokeWidth)))
      );
    }
    
    d2Shine = max(max(d2LeftEdge, d2TopBottomEdge), d2CircleEdge) * d2;
    
    // D (now leftmost due to flip) - HALF-CIRCLE RIGHT SIDE, SQUARE LEFT SIDE
    float d1 = 0.0;
    float d1Shine = 0.0; // Shine for D1
    vec2 d1Pos = rotPos - vec2(-letterWidth - letterSpacing, 0.0);
    
    // Left vertical bar (square) - with softer edges
    float d1BarDist = abs(d1Pos.x + letterWidth/2.0) - dStrokeWidth;
    float d1Bar = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, d1BarDist);
    d1Bar *= smoothstep(-letterHeight/2.0 - dStrokeWidth - edgeSoftness, -letterHeight/2.0 - dStrokeWidth + baseSoftness, d1Pos.y) * 
             smoothstep(letterHeight/2.0 + dStrokeWidth + edgeSoftness, letterHeight/2.0 + dStrokeWidth - baseSoftness, d1Pos.y);
    
    // Right half-circle part - with softer edges
    vec2 d1CircleCenter = vec2(-letterWidth/2.0 + dStrokeWidth, 0.0);
    
    // Only draw the right half of the circle with softer edges
    float d1Circle = 0.0;
    if (d1Pos.x >= -letterWidth/2.0 + dStrokeWidth - edgeSoftness) {
      float distToCenter = length(d1Pos - d1CircleCenter);
      float outerEdge = smoothstep(halfCircleRadius + dStrokeWidth + edgeSoftness, halfCircleRadius + dStrokeWidth - baseSoftness, distToCenter);
      float innerEdge = smoothstep(halfCircleRadius - dStrokeWidth - edgeSoftness, halfCircleRadius - dStrokeWidth + baseSoftness, distToCenter);
      d1Circle = outerEdge * innerEdge;
    }
    
    // Combine vertical bar and half-circle with smooth max
    d1 = max(d1Bar, d1Circle);
    
    // Calculate shine for D1 with softer edges
    float d1EdgeFactor = 0.03;
    float d1LeftEdge = smoothstep(d1EdgeFactor, 0.0, abs(abs(d1Pos.x + letterWidth/2.0) - dStrokeWidth));
    float d1TopBottomEdge = max(
      smoothstep(d1EdgeFactor, 0.0, abs(abs(d1Pos.y - letterHeight/2.0) - dStrokeWidth)),
      smoothstep(d1EdgeFactor, 0.0, abs(abs(d1Pos.y + letterHeight/2.0) - dStrokeWidth))
    );
    
    // Circle edge detection with softer transition
    float d1CircleEdge = 1.0;
    if (d1Pos.x >= -letterWidth/2.0 + dStrokeWidth - edgeSoftness) {
      float distToCenter = length(d1Pos - d1CircleCenter);
      d1CircleEdge = max(
        smoothstep(d1EdgeFactor, 0.0, abs(distToCenter - (halfCircleRadius + dStrokeWidth))),
        smoothstep(d1EdgeFactor, 0.0, abs(distToCenter - (halfCircleRadius - dStrokeWidth)))
      );
    }
    
    d1Shine = max(max(d1LeftEdge, d1TopBottomEdge), d1CircleEdge) * d1;
    
    // ENSURE CONSISTENT HEIGHT: Use the same multiplier for all letters
    float letterMultiplier = 0.075;
    float mHeight = m * letterMultiplier;
    float d1Height = d1 * letterMultiplier;
    float d2Height = d2 * letterMultiplier;
    
    // Combine all letters with consistent height
    letterPattern = max(max(mHeight, d1Height), d2Height);
    
    // Only set inLogoArea where there are actual letters
    // Add a small buffer around letters for smooth transition
    float letterBuffer = 0.01;
    inLogoArea = smoothstep(0.0, 0.02, letterPattern); // Smooth transition for logo area
    
    // Combine shine effects with smoother transition
    shine = max(max(mShine, d1Shine), d2Shine);
    
    // Add wobbling effect to shine
    float wobbleSpeed = 10.0;
    float wobbleAmount = 0.5;
    shine *= 0.7 + 0.3 * sin(normalizedTime * wobbleSpeed + pos.x * 20.0 + pos.y * 20.0) * wobbleAmount;
  }
  
  // Return the logo pattern
  return letterPattern;
}

// Function to check if two positions are too close
bool tooClose(vec2 pos1, vec2 pos2, float minDist) {
  return distance(pos1, pos2) < minDist;
}

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // FASTER ANIMATION CYCLE: Much shorter duration for quicker animations
  float loopDuration = 15.0; // Was 25.0, reduced to 10.0 for faster cycle
  float loopTime = mod(u_time, loopDuration);
  float normalizedTime = loopTime / loopDuration; // 0 to 1 range
  
  // Define number of logo instances - REDUCED
  const int NUM_LOGOS = 3; // Reduced from original number
  
  // Variables for logo positions and states
  vec2 logoPositions[NUM_LOGOS];
  bool logoActive[NUM_LOGOS];
  float logoStrengths[NUM_LOGOS];
  float logoLifetimes[NUM_LOGOS]; // Used to track how long logos have been active
  
  // Initialize arrays
  for (int i = 0; i < NUM_LOGOS; i++) {
    logoPositions[i] = vec2(0.0);
    logoActive[i] = false;
    logoStrengths[i] = 0.0;
    logoLifetimes[i] = 0.0;
  }
  
  // Define pattern parameters
  float finalLogoPattern = 0.0;
  float finalShine = 0.0;
  float inAnyLogoArea = 0.0;
  float localWaveHeight = 0.0;
  float finalPatternStrength = 0.0;
  
  // Minimum distance between logos for collision prevention
  float minLogoDistance = 1.2; // INCREASED for better separation
  
  // INDEPENDENT TIMING FOR EACH LOGO
  float logoTimeOffsets[NUM_LOGOS];
  
  // Generate random offsets for each logo
  for (int i = 0; i < NUM_LOGOS; i++) {
    // Create a unique seed for each logo's timing
    float timingSeed = floor(u_time / 50.0) + float(i) * 237.53;
    // Random offset between 0 and 1 for each logo
    logoTimeOffsets[i] = random(timingSeed);
  }
  
  // Animation parameters
  float apexDuration = 0.5 / loopDuration; // 0.5 seconds at apex
  float riseTime = 0.15; // 15% of cycle for rise
  float fallTime = 0.15; // 15% of cycle for fall
  
  // First pass: update logo positions and states
  for (int i = 0; i < NUM_LOGOS; i++) {
    // Calculate individual normalized time for this logo
    float logoTime = fract(normalizedTime + logoTimeOffsets[i]);
    
    // Calculate individual pattern strength for this logo
    float logoPatternStrength = 0.0;
    
    if (logoTime < riseTime) {
      // Fast rise phase - cubic easing
      float normalized = logoTime / riseTime;
      logoPatternStrength = normalized * normalized * (3.0 - 2.0 * normalized);
    } 
    else if (logoTime < riseTime + apexDuration) {
      // Brief apex
      logoPatternStrength = 1.0;
    }
    else if (logoTime < riseTime + apexDuration + fallTime) {
      // Fast fall phase - cubic easing
      float normalized = 1.0 - (logoTime - (riseTime + apexDuration)) / fallTime;
      logoPatternStrength = normalized * normalized * (3.0 - 2.0 * normalized);
    }
    else {
      // Rest of cycle - invisible
      logoPatternStrength = 0.0;
    }
    
    // Check if we should activate this logo
    if (!logoActive[i] && logoPatternStrength > 0.005) {
      // Randomize pattern position for each cycle and instance
      float cycleSeed = floor(u_time / 30.0) + float(i) * 100.0;
      
      // Generate random coordinates with more spread
      float randX = random(cycleSeed) * 1.8 - 0.9;
      float randZ = random(cycleSeed + 100.0) * 1.8 - 0.9;
      
      // Fixed positions with slight circular motion
      float positionBlend = 0.2; // Less circular motion
      float circleRadius = 0.5 + float(i) * 0.2; // Different radius for each instance
      float circlePhaseOffset = float(i) * 2.1; // Different starting position
      
      vec2 center = mix(
        vec2(randX, randZ),
        vec2(
          sin(normalizedTime * 6.28 * 0.2 + circlePhaseOffset) * circleRadius, 
          cos(normalizedTime * 6.28 * 0.2 + circlePhaseOffset) * circleRadius
        ),
        positionBlend
      );
      
      // IMPROVED COLLISION DETECTION: Check against all logos regardless of state
      bool collision = false;
      for (int j = 0; j < NUM_LOGOS; j++) {
        if (i != j) { // Don't check against self
          // Calculate the other logo's effective radius based on its strength
          float otherLogoRadius = minLogoDistance * logoStrengths[j];
          
          // Only consider logos that have some visibility
          if (logoStrengths[j] > 0.01 && distance(center, logoPositions[j]) < minLogoDistance) {
            collision = true;
            break;
          }
        }
      }
      
      // If no collision, mark this logo as active
      if (!collision) {
        logoPositions[i] = center;
        logoActive[i] = true;
        logoStrengths[i] = logoPatternStrength;
      }
    } 
    // Update existing active logo
    else if (logoActive[i]) {
      logoStrengths[i] = logoPatternStrength;
      
      // Deactivate logo if pattern strength is very low
      if (logoPatternStrength < 0.005) {
        logoActive[i] = false;
      }
    }
  }
  
  // CONTINUOUS COLLISION PREVENTION: Check for overlaps every frame
  for (int i = 0; i < NUM_LOGOS; i++) {
    if (logoActive[i]) {
      for (int j = i+1; j < NUM_LOGOS; j++) {
        if (logoActive[j]) {
          // If two active logos are too close, reduce the strength of the weaker one
          if (distance(logoPositions[i], logoPositions[j]) < minLogoDistance * 0.7) {
            if (logoStrengths[i] < logoStrengths[j]) {
              logoStrengths[i] *= 0.8; // Fade out the weaker logo faster
            } else {
              logoStrengths[j] *= 0.8; // Fade out the weaker logo faster
            }
          }
        }
      }
    }
  }
  
  // Second pass: render active logos
  for (int i = 0; i < NUM_LOGOS; i++) {
    if (logoActive[i]) {
      float cycleSeed = floor(u_time / (loopDuration * 2.0)) + float(i) * 100.0;
      
      // Create this logo instance
      float shine = 0.0;
      float inLogoArea = 0.0;
      float logoLocalWaveHeight = 0.0;
      float logoPattern = createLogo(modelPosition.xz, logoPositions[i], normalizedTime, logoStrengths[i], cycleSeed, shine, inLogoArea, logoLocalWaveHeight);
      
      // Combine with other logos using max to avoid overlapping
      if (logoPattern > finalLogoPattern) {
        finalLogoPattern = logoPattern;
        finalShine = shine;
        inAnyLogoArea = inLogoArea;
        localWaveHeight = logoLocalWaveHeight;
        finalPatternStrength = logoStrengths[i];
      }
    }
  }
  
  // Calculate the base wave height - EXACT SAME CALCULATION AS localWaveHeight
  float baseWave = calculateBaseWaveHeight(modelPosition.xz, normalizedTime);
  
  // CRITICAL THRESHOLD: Force exact zero height relative to wave at start/end
  float threshold = 0.005; // Use a very small threshold for better precision
  
  // Calculate the final height
  float finalHeight = 0.0;
  
  if (finalPatternStrength <= threshold) {
    // For very low strengths: EXACTLY match the base wave height
    finalHeight = baseWave;
  } else {
    // For visible strengths: Renormalize strength and apply smooth scaling
    // This creates a proper zero-to-full range for the visible part
    float normalizedStrength = (finalPatternStrength - threshold) / (1.0 - threshold);
    
    // Scale all components based on normalized strength for smooth transition
    float letterContribution = finalLogoPattern * normalizedStrength;
    float shineContribution = finalShine * 0.02 * normalizedStrength;
    float gentleWave = sin(normalizedTime * 6.28 * 0.5) * 0.01 * normalizedStrength;
    
    // Total height is base wave plus all scaled components
    finalHeight = baseWave + letterContribution + gentleWave + shineContribution;
  }
  
  modelPosition.y += finalHeight;
  
  // Scale fragment shader outputs with same threshold logic
  float outputScale = (finalPatternStrength <= threshold) ? 0.0 : finalPatternStrength;
  vZ = modelPosition.y;
  vPattern = finalLogoPattern * 5.0 * outputScale;
  vShine = finalShine * outputScale;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

export default vertexShader