let nosePosition = [];
let circles = [];
let movementThreshold = 15;
let period = 10000; //10 seconds

function setup() {
    createCanvas(windowWidth, windowHeight);
    setupMoveNet();
}

function draw() {
    background('white');
    updateMoveNet();
    drawMirroredCam(windowWidth / 2 - 320, windowHeight / 2 - 240);

    fill(0, 255, 100);
    ellipse(pose.nose.x + (windowWidth / 2 - 320), pose.nose.y + (windowHeight / 2 - 240), 10, 10);

    noseMovement();
    movementCount();
    drawCircles();
}

function noseMovement() {
    let currentTime = millis();
    nosePosition.push({ time: currentTime, x: pose.nose.x, y: pose.nose.y });

    // Remove positions older than the period
    nosePosition = nosePosition.filter(function (mostRecent) {
        return currentTime - mostRecent.time <= period;
    });
}

function movementCount() {
    //valid jump
    let count = 0;
    for (let i = 1; i < nosePosition.length; i++) {
        let dy = Math.abs(nosePosition[i].y - nosePosition[i - 1].y);
        if (dy > movementThreshold) {
            count++;
        }
    }
    console.log(count);

    //jumping speed indicator
    let movementPerSecond = count / (period / 1000);

    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    if (movementPerSecond >= 1) {
        text("Slower!", width / 2 - 265, height / 2 - 265);
        addCircle();
    } else {
        text("Jump!", width / 2 - 270, height / 2 - 265);
    }

    textSize(16);
    text("Movement Count (last 10s): " + count, width / 2+210, height / 2 -275);
    text("Movements Per Second: " + movementPerSecond.toFixed(2), width / 2+210, height / 2 -255);
}


function addCircle() {
    for (let i = 0; i < 5; i++) {
        circle = {
            x: random(width),
            y: random(height),
            size: random(10, 30),
            color: [random(60, 243), 0, random(100, 255)],
            speedX: random(-4, 4),
            speedY: random(-4, 4)
        };
        circles.push(circle);
    }
}

function drawCircles() {
    for (let circle of circles) {
        noStroke();
        fill(circle.color);
        circle.x += circle.speedX;
        circle.y += circle.speedY;
        ellipse(circle.x, circle.y, circle.size, circle.size);
    }

    //remove circles outside the canvas
    circles = circles.filter(function (circle) {
        return circle.x > 0 && circle.x < width && circle.y > 0 && circle.y < height;
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}