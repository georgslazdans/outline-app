import { ShaderMaterialProps } from "@react-three/fiber";
import { NormalBlending } from "three";

const pointShaderMaterialOf = (
  radius: number,
  alpha: number = 0.3
): ShaderMaterialProps => {
  return {
    uniforms: {
      uRadius: { value: radius },
      uAlpha: { value: alpha },
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vColor;
        void main() {
          vUv = uv;
          vColor = instanceColor;

          // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
        uniform float uRadius;
        uniform float uAlpha;
        varying vec2 vUv;
        varying vec3 vColor;
  
        void main() {
          float dist = length(vUv - vec2(0.5, 0.5)) * uRadius; // Distance from center
          float edgeDist = 0.6 * uRadius; // Thickness of the outline
          float centerDist = 0.1 * uRadius; // Center point size

          if (dist < centerDist) {
            gl_FragColor = vec4(vColor, 1.0);
          } else if (dist < uRadius - edgeDist) {
            gl_FragColor =  vec4(vColor, uAlpha);
          } else if (dist < uRadius) {
            gl_FragColor =  vec4(vColor, 1.0);
          } else {
            discard; // Outside the circle
          }
        }
      `,
    vertexColors: true,
    transparent: true,
    depthWrite: false, // Prevents the material from writing to the depth buffer
    // blending: NormalBlending,
    blending: NormalBlending,
  };
};

export default pointShaderMaterialOf;
