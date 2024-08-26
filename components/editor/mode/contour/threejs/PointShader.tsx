import { ShaderMaterialProps } from "@react-three/fiber";
import {
  Color,
  NormalBlending,
} from "three";

const pointShaderMaterialOf = (
  radius: number,
  color: string,
  alpha: number = 0.3,
): ShaderMaterialProps => {
  return {
    uniforms: {
      uColor: { value: new Color(color) },
      uRadius: { value: radius },
      uAlpha: { value: alpha },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform float uRadius;
        uniform float uAlpha;
        varying vec2 vUv;
  
        void main() {
          float dist = length(vUv - vec2(0.5, 0.5)); // Distance from center
          float edgeDist = 0.6; // Thickness of the outline
          float centerDist = 0.1; // Center point size

          if (dist < centerDist) {
            gl_FragColor = vec4(uColor, 1.0);
          } else if (dist < uRadius - edgeDist) {
            gl_FragColor = vec4(uColor, uAlpha);
          } else if (dist < uRadius) {
            gl_FragColor = vec4(uColor, 1.0);
          } else {
            discard; // Outside the circle
          }
        }
      `,
    transparent: true,
    depthWrite: false, // Prevents the material from writing to the depth buffer
    blending: NormalBlending
  };
};

export default pointShaderMaterialOf;
