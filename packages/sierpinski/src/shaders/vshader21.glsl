attribute vec4 vPosition;

void main() {
    gl_PointSize = 3.0;
    gl_Position = vPosition;
}
