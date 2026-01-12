import './style.css';
import { Node } from './canvas/node';
import { Canvas } from './canvas/canvas';
import { svg_run_icon, svg_cmd_icon } from './constants';

const div = document.querySelector<HTMLDivElement>('#canvas')!;
const canvas = new Canvas(div);

new Node(canvas.content, { x: 0, y: 0 }, { image: svg_run_icon });
new Node(canvas.content, { x: 240, y: 96 }, { image: svg_cmd_icon });
