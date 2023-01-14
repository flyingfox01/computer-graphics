import { MV } from 'utils';

const { vec2, mix } = MV;

const generagePoints = () => {
  const NumPoints = 5000;
  // 初始三角形位置
  const vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];

  // (1) 随机找一个点p
  let p = vec2(Math.random(), Math.random());
  const points = [p];

  for (let i = 0; i < NumPoints; ++i) {
    // (2) 随机三个顶点之一q
    const q = vertices[Math.floor(Math.random() * 3)];
    // (3) 得到p和q的中点，并替换掉p
    p = mix(points[i], q, 0.5);
    points.push(p);
    // 转至(2)
  }

  // 加上原始的三个点
  points.push(...vertices);

  return points;
};

export default generagePoints;
