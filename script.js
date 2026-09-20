import { containerRestrictionRatio, moveAwayIntensity, postAngleIntensity, posiblePosInSpace, postcardSizeRatio, mouse, cards, hideTitle } from "./constant";
import { initWebglPostcard } from "./webgl-demo";

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
const width = containerRect.width * containerRestrictionRatio;
const height = containerRect.height * containerRestrictionRatio;

if (hideTitle) {
    document.querySelector('h1').remove()
}

let points = [];
let initialTranslate = [];
let initialRotate = [];
export let openedCardId = null;

function buildCards() {
    Array.from(pointsEl.querySelectorAll('.point')).forEach(el => el.remove());
    points = [];
    initialTranslate = [];
    initialRotate = [];

    pointsEl.style.setProperty('--ratio', postcardSizeRatio);

    const possiblePos = [];
    for (let i = 0; i <= Math.trunc(width / posiblePosInSpace); i++) {
        for (let j = 0; j <= Math.trunc(height / posiblePosInSpace); j++) {
            possiblePos.push([i * posiblePosInSpace - (width / 2) - (250 * postcardSizeRatio), j * posiblePosInSpace - (height / 2) - (250 * postcardSizeRatio)]);
        }
    }

    cards.forEach((card, i) => {
        const randIndex = Math.trunc(possiblePos.length * Math.random());
        initialTranslate[i] = possiblePos[randIndex];
        initialRotate[i] = Math.random() * postAngleIntensity * (Math.random() > 0.5 ? 1 : -1);
        possiblePos.splice(randIndex, 1)
    })


    cards.forEach((card, i) => {
        const cardWidth = card.width;
        const cardHeight = card.height;


        const li = document.createElement('li')
        li.classList.add('point')
        li.style.setProperty('--z-index', i + 1);

        const button = document.createElement('button');
        button.setAttribute('id', `postcard-${card.id}`);
        button.setAttribute('type', "button");
        button.setAttribute('aria-label', `Postcard : ${card.description.en || card.description.jp}`);
        button.style.setProperty('--width', `${cardWidth}px`);
        button.style.setProperty('--height', `${cardHeight}px`);
        button.style.setProperty('--blur-level', getBlurLevel(i));
        button.style.transform = `translate(${initialTranslate[i][0]}px, ${initialTranslate[i][1]}px) rotate(${initialRotate[i]}deg)`

        const imgEl = document.createElement('img');
        imgEl.style.display = 'none';
        imgEl.setAttribute('src', `./images/500/${card.id}a.webp`);

        imgEl.addEventListener('load', () => {
            imgEl.style.display = 'block';
        });
        imgEl.setAttribute('alt', card.alt);

        button.appendChild(imgEl);

        points.push(button)

        button.addEventListener('pointerenter', e => {
            loadImage(`./images/700/${card.id}a.webp`)
            loadImage(`./images/700/${card.id}b.webp`)

            activatePoint(e)
        })
        button.addEventListener('focus', activatePoint)
        button.addEventListener('click', e => {
            openedCardId = card.id;
            document.querySelector("#canvas-layer").style.display = 'block';
            setTimeout(() => {
                initWebglPostcard()
            })
        })

        button.addEventListener('pointerleave', deactivatePoint);
        button.addEventListener('blur', deactivatePoint);

        li.appendChild(button)

        pointsEl.appendChild(li);
    })
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
    return `${(cards.length - index - 1) * 0.05}px`
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
    document.getElementById(`postcard-${openedCardId}`).focus()
    openedCardId = null;
    document.querySelector("#canvas-layer").style.display = 'none';
}

function loadImage(src) {
    const img = new Image();
    img.src = src;
}