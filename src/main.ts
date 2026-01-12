import './style.css';
import { Canvas } from './canvas/canvas';
import { Node } from './canvas/node';

const div = document.querySelector<HTMLDivElement>('#canvas')!;
const canvas = new Canvas(div);

const iconRun =
`data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
fill='none' stroke='%23999' stroke-width='2'
stroke-linecap='round' stroke-linejoin='round'>
<path d='M3 3l18 9-9 3-3 9z'/>
</svg>`

const iconCmd =
`data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
fill='none' stroke='%23999' stroke-width='2'
stroke-linecap='round' stroke-linejoin='round'>
<polyline points='4 17 10 11 4 5'/>
<line x1='12' y1='19' x2='20' y2='19'/>
</svg>`;


new Node(canvas.content, { x: 0, y: 0 }, {image: iconCmd})
new Node(canvas.content, { x: 240, y: 96 }, {image: iconRun})
// new Node(canvas.content, { x: 120, y: 192 }, {image: iconCmd})
