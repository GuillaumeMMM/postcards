import { initWebglPostcard } from "./webgl-demo";

export const cards = [
    { id: 10, width: 500, height: 341 },
    { id: 11, width: 500, height: 337 },
    { id: 12, width: 500, height: 355 },
    { id: 13, width: 500, height: 324 },
    { id: 14, width: 500, height: 338 },
    { id: 15, width: 337, height: 500 },
    { id: 16, width: 353, height: 500 },
    { id: 17, width: 337, height: 500 },
    { id: 18, width: 500, height: 357 },
    { id: 19, width: 500, height: 350 },
    { id: 1, width: 500, height: 358 },
    { id: 20, width: 500, height: 363 },
    { id: 21, width: 335, height: 500 },
    { id: 22, width: 500, height: 361 },
    { id: 23, width: 361, height: 500 },
    { id: 24, width: 500, height: 361 },
    { id: 25, width: 500, height: 361 },
    { id: 26, width: 500, height: 357 },
    { id: 2, width: 335, height: 500 },
    { id: 3, width: 500, height: 337 },
    { id: 4, width: 500, height: 350 },
    { id: 5, width: 500, height: 337 },
    { id: 6, width: 500, height: 350 },
    { id: 7, width: 500, height: 337 },
    { id: 8, width: 500, height: 325 },
    { id: 9, width: 339, height: 500 }
]

export const mouse = { x: 0, y: 0 }
export let openedCardId = null;

document.addEventListener('pointermove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

document.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
        closeCanvas()
    }
})

const pointsEl = document.querySelector('.points');
const containerRect = document.querySelector('.container').getBoundingClientRect();
const width = containerRect.width * 0.6;
const height = containerRect.height * 0.6;

const moveAwayIntensity = 15;
const cardsCount = cards.length;
const postAngleIntensity = 12;
const posiblePosInSpace = 30;
const ratio = 0.3;

let points = [];
let initialTranslate = [];
let initialRotate = [];

function buildCards() {
    Array.from(pointsEl.querySelectorAll('.point')).forEach(el => el.remove());
    points = [];
    initialTranslate = [];
    initialRotate = [];

    pointsEl.style.setProperty('--ratio', ratio);

    const possiblePos = [];
    for (let i = 0; i <= Math.trunc(width / posiblePosInSpace); i++) {
        for (let j = 0; j <= Math.trunc(height / posiblePosInSpace); j++) {
            possiblePos.push([i * posiblePosInSpace - (width / 2) - (250 * ratio), j * posiblePosInSpace - (height / 2) - (250 * ratio)]);
        }
    }

    for (let i = 0; i < cardsCount; i++) {
        const randIndex = Math.trunc(possiblePos.length * Math.random());
        initialTranslate[i] = possiblePos[randIndex];
        initialRotate[i] = Math.random() * postAngleIntensity * (Math.random() > 0.5 ? 1 : -1);
        possiblePos.splice(randIndex, 1)
    }

    for (let i = 0; i < cardsCount; i++) {
        const cardWidth = cards.find(c => c.id === i + 1).width;
        const cardHeight = cards.find(c => c.id === i + 1).height;


        const li = document.createElement('li')
        li.classList.add('point')
        li.style.setProperty('--z-index', i + 1);

        const button = document.createElement('button');

        button.style.setProperty('--width', `${cardWidth}px`);
        button.style.setProperty('--height', `${cardHeight}px`);
        button.style.setProperty('--blur-level', getBlurLevel(i));
        button.style.transform = `translate(${initialTranslate[i][0]}px, ${initialTranslate[i][1]}px) rotate(${initialRotate[i]}deg)`

        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', `./assets/images/500/${i + 1}a.webp`)

        button.appendChild(imgEl);

        points.push(button)

        button.addEventListener('pointerenter', activatePoint)
        button.addEventListener('focus', activatePoint)
        button.addEventListener('click', e => {
            openedCardId = i + 1;
            document.querySelector("#canvas-layer").style.display = 'block';
            setTimeout(() => {
                initWebglPostcard()
            })
        })

        button.addEventListener('pointerleave', deactivatePoint);
        button.addEventListener('blur', deactivatePoint);

        li.appendChild(button)

        pointsEl.appendChild(li);
    }
}

buildCards();


function translateAwayDelta(anchorPoint, pointToMove, intensity) {
    const dx = pointToMove[0] - anchorPoint[0];
    const dy = pointToMove[1] - anchorPoint[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return [0, 0];

    const ux = dx / distance;
    const uy = dy / distance;

    const decayRate = 0.005;
    const falloff = 20 * intensity * Math.exp(-decayRate * distance);

    return [ux * falloff, uy * falloff];
}

function getBlurLevel(index) {
    return `${(cardsCount - index - 1) * 0.05}px`
}

function activatePoint(e) {
    const hoveredPoint = e.currentTarget;
    const hoverIndex = points.indexOf(hoveredPoint);

    hoveredPoint.style.transform = `translate(${initialTranslate[hoverIndex][0]}px, ${initialTranslate[hoverIndex][1]}px) rotate(${initialRotate[hoverIndex]}deg) scale(1.15)`;

    hoveredPoint.style.setProperty('--blur-level', `0px`);

    for (const pt of points) {
        if (pt === hoveredPoint || (Number(hoveredPoint.style.zIndex) > Number(pt.style.zIndex))) {
            continue;
        }

        pt.style.setProperty('--blur-level', `0px`);

        const index = points.indexOf(pt)
        const translation = translateAwayDelta(initialTranslate[hoverIndex], initialTranslate[index], moveAwayIntensity)
        pt.style.transform = `translate(${initialTranslate[index][0] + translation[0]}px, ${initialTranslate[index][1] + translation[1]}px) rotate(${initialRotate[index]}deg)`

    }
}

function deactivatePoint(e) {
    for (const pt of points) {
        const index = points.indexOf(pt)
        pt.style.setProperty('--blur-level', getBlurLevel(index));

        if (pt === e.target) {
            pt.style.transform = `translate(${initialTranslate[index][0]}px, ${initialTranslate[index][1]}px) rotate(${initialRotate[index]}deg) scale(1)`
            continue;
        }
        pt.style.transform = `translate(${initialTranslate[index][0]}px, ${initialTranslate[index][1]}px) rotate(${initialRotate[index]}deg)`
    }
}

export function closeCanvas() {
    openedCardId = null;
    document.querySelector("#canvas-layer").style.display = 'none';
}