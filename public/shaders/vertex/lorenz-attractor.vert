attribute vec3 a_position;
uniform mat4 u_mvpMatrix;
uniform float u_pointSize;

void main() {
  gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
  gl_PointSize = u_pointSize;
}