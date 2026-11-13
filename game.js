/* Readable ES5 JavaScript. No framework, modules, external libraries or build step. */
function initializeSmileGame() {
    if (!document.getElementById('orangeCanvas')) { return; }
    if (window.cleanupSmileGame) { window.cleanupSmileGame(); }
    var cleanupListeners = [];
    function onGlobal(target, name, handler, options) {
        target.addEventListener(name, handler, options);
        cleanupListeners.push(function () { target.removeEventListener(name, handler, options); });
    }
    var disposed = false;
    window.cleanupSmileGame = function () {
        if (disposed) { return; }
        disposed = true;
        if (timer !== null) { window.clearTimeout(timer); timer = null; }
        if (completionActionTimer !== null) { window.clearTimeout(completionActionTimer); completionActionTimer = null; }
        runId += 1;
        complete = false;
        trail = [];
        try { video.pause(); } catch (ignore) {}
        cleanupListeners.forEach(function (remove) { remove(); });
        replayButton.onclick = null;
        if (window.onSmileComplete === onSmileCompleteHandler) { window.onSmileComplete = null; }
        if (window.resetSmileGame === resetSmileGameHandler) { window.resetSmileGame = null; }
        window.cleanupSmileGame = null;
    };
    'use strict';
	
	var SMILE_SETTINGS = {
    width: 1180,
    height: 775,

    // Files: replace a path here if needed.
    background: 'slide1/background.png',
    grayImage: 'slide1/smile-gray.png',
    orangeImage: 'slide1/smile-orange.png',
    video: 'slide1/completion.mp4',
    videoDelay: 1000,
    videoMuted: false,

    // Smile appearance: width stays the same; height is increased by 15%.
    // Change smileHeightScale only; the images AND tracing curve follow together.
    imageBox: { x: 420, y: 407.5, width: 372.5, height: 150 },
    smileHeightScale: 1.15,
    curve: [[440,429.5], [472,560], [740,560], [772,429.5]],
    strokeWidth: 27,

    // Touch area ONLY: 34px either side of the curve (previously 25px).
    // This does not change the visible smile's width, height or thickness.
    fingerTolerance: 34,
    sampleCount: 220,

    // Glow appearance.
    glowRadius: 47.5,
    glowColor: '255, 190, 35',
    glowCanvasMaxWidth: 1180
	};
	
	

    var config = SMILE_SETTINGS;

    // Short helper for looking up HTML elements.
    function getElement(id) { return document.getElementById(id); }
    var stage = getElement('stage');
    var canvas = getElement('orangeCanvas');
    var ctx = canvas.getContext('2d');
    var glow = getElement('glowCanvas');
    var glowCtx = glow.getContext('2d');
    var gray = getElement('graySmile');
    var background = getElement('background');
    var instruction = getElement('instruction');
    var video = getElement('completionVideo');
    var videoLayer = getElement('videoLayer');
    var replayButton = getElement('replay');
    var orange = new Image();
    // One shared vertical scale keeps the gray image, orange image and curve aligned.
    var heightScale = config.smileHeightScale;
    var box = {
        x: config.imageBox.x,
        y: config.imageBox.y,
        width: config.imageBox.width,
        height: config.imageBox.height * heightScale
    };
    var points = [], visited = [], covered = 0;
    var ready = false, complete = false, dragging = false;
    var pointerId = null, lastPoint = null, lastIndex = -1;
    var timer = null, completionActionTimer = null, glowRunning = false, completedAt = 0;
    var videoFrameVisible = false;
    var trail = [], lastTouch = 0, runId = 0;
    var raf = window.requestAnimationFrame || function (fn) { return window.setTimeout(fn, 16); };

    // 1. FIXED STAGE. Scale visually, but keep all tracing math at full resolution.
    canvas.width = config.width;
    canvas.height = config.height;
    stage.style.width = config.width + 'px';
    stage.style.height = config.height + 'px';
    glow.width = Math.min(config.width, config.glowCanvasMaxWidth);
    glow.height = Math.round(glow.width * config.height / config.width);
    var glowScale = glow.width / config.width;
    gray.style.left = box.x + 'px';
    gray.style.top = box.y + 'px';
    gray.style.width = box.width + 'px';
    gray.style.height = box.height + 'px';

    function fitStage() {
        var scale = Math.min(window.innerWidth / config.width, window.innerHeight / config.height);
        stage.style.transform = 'scale(' + scale + ')';
        stage.style.webkitTransform = 'scale(' + scale + ')';
        stage.style.left = (window.innerWidth - config.width * scale) / 2 + 'px';
        stage.style.top = (window.innerHeight - config.height * scale) / 2 + 'px';
        stopDrawing();
    }
    onGlobal(window, 'resize', fitStage, false);
    onGlobal(window, 'orientationchange', fitStage, false);
    fitStage();

    // 2. ONE SHARED CURVE for the guide, reveal and completion detection.
    function curvePoint(t) {
        var curve = config.curve;
        var u = 1 - t;
        var startWeight = u * u * u;
        var firstWeight = 3 * u * u * t;
        var secondWeight = 3 * u * t * t;
        var endWeight = t * t * t;
        var x = startWeight * curve[0][0] + firstWeight * curve[1][0] +
                secondWeight * curve[2][0] + endWeight * curve[3][0];
        var y = startWeight * curve[0][1] + firstWeight * curve[1][1] +
                secondWeight * curve[2][1] + endWeight * curve[3][1];
        return { x: x, y: box.y + (y - box.y) * heightScale };
    }
    for (var i = 0; i <= config.sampleCount; i += 1) {
        points.push(curvePoint(i / config.sampleCount));
        visited.push(false);
    }

    var loaded = 0;
    function assetLoaded() {
        if (disposed) { return; }
        loaded += 1;
        if (loaded === 3) {
            ready = true;
            instruction.textContent = 'Trace the gray smile with your finger';
        }
    }
    function assetError() { if (disposed) { return; } instruction.textContent = 'An image could not load. Please reload the game.'; }
    background.onload = assetLoaded; gray.onload = assetLoaded; orange.onload = assetLoaded;
    background.onerror = assetError; gray.onerror = assetError; orange.onerror = assetError;
    background.src = config.background; gray.src = config.grayImage; orange.src = config.orangeImage;
    video.controls = false;
    video.removeAttribute('controls');
	video.muted = false;
	video.defaultMuted = false;
	video.removeAttribute('muted');
	video.volume = 1;
	video.src = config.video;

    function pointerPosition(event) {
        var r = canvas.getBoundingClientRect();
        return { x: (event.clientX - r.left) * config.width / r.width,
                 y: (event.clientY - r.top) * config.height / r.height };
    }
    function nearestPoint(p) {
        var best = -1, bestDistance = Infinity;
        for (var n = 0; n < points.length; n += 1) {
            var dx = p.x - points[n].x, dy = p.y - points[n].y;
            var squared = dx*dx + dy*dy;
            if (squared < bestDistance) { bestDistance = squared; best = n; }
        }
        return bestDistance <= config.fingerTolerance * config.fingerTolerance ? best : -1;
    }

    // Reject a shortcut THROUGH the smile's empty center, but never lock input.
    // Check intermediate positions even if a fast device reports very few events.
    function followsCurve(a, b) {
        var dx = b.x - a.x, dy = b.y - a.y;
        var steps = Math.ceil(Math.sqrt(dx*dx + dy*dy) / (config.fingerTolerance / 2));
        for (var n = 1; n < steps; n += 1) {
            if (nearestPoint({x: a.x + dx*n/steps, y: a.y + dy*n/steps}) < 0) { return false; }
        }
        return true;
    }

    // 3. REVEAL ONLY THE VISITED ARC. Clip to a polygon around that arc, then
    // draw the separate orange image inside it. No full-size offscreen mask.
    function drawOrangeImage() {
        ctx.drawImage(orange, box.x, box.y, box.width, box.height);
    }

    function revealRange(first, last) {
        var left = Math.max(0, Math.min(first, last) - 2);
        var right = Math.min(points.length - 1, Math.max(first, last) + 2);
        var half = config.strokeWidth * Math.max(1, heightScale) / 2 + 2.5;
        var n, a, b, length, nx, ny;
        var edgeA = [], edgeB = [];
        var newPixels = false;
        for (n = left; n <= right; n += 1) {
            if (!visited[n]) { visited[n] = true; covered += 1; newPixels = true; }
        }
        if (!newPixels) { return; }
        for (n = left; n <= right; n += 1) {
            a = points[Math.max(0, n - 1)]; b = points[Math.min(points.length - 1, n + 1)];
            length = Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y));
            nx = -(b.y-a.y) / length * half; ny = (b.x-a.x) / length * half;
            edgeA.push({x: points[n].x + nx, y: points[n].y + ny});
            edgeB.push({x: points[n].x - nx, y: points[n].y - ny});
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(edgeA[0].x, edgeA[0].y);
        for (n = 1; n < edgeA.length; n += 1) { ctx.lineTo(edgeA[n].x, edgeA[n].y); }
        for (n = edgeB.length - 1; n >= 0; n -= 1) { ctx.lineTo(edgeB[n].x, edgeB[n].y); }
        ctx.closePath();
        // Include the original artwork's rounded endcaps only at the ends.
        if (left === 0) { ctx.moveTo(points[0].x + half, points[0].y); ctx.arc(points[0].x, points[0].y, half, 0, Math.PI*2, true); }
        if (right === points.length-1) { a = points[right]; ctx.moveTo(a.x+half,a.y); ctx.arc(a.x,a.y,half,0,Math.PI*2,true); }
        ctx.clip();
        drawOrangeImage();
        ctx.restore();
    }

    function begin(p) {
        if (!ready || complete) { return; }
        dragging = true; lastPoint = null; lastIndex = -1;
        move(p);
    }
    function move(p) {
        if (!dragging || complete || !ready) { return; }
        var index = nearestPoint(p);
        if (index < 0) {
            lastPoint = null; lastIndex = -1;
            return; // Return to the path to continue, without lifting or restarting.
        }
        if (lastPoint && followsCurve(lastPoint, p)) { revealRange(lastIndex, index); }
        else { revealRange(index, index); }
        lastPoint = p; lastIndex = index;
        trail.push({x: points[index].x, y: points[index].y, time: Date.now()});
        if (trail.length > 24) { trail.shift(); }
        startGlow();
        if (covered === points.length) { finishSmile(); }
    }
    function stopDrawing() { dragging = false; pointerId = null; lastPoint = null; lastIndex = -1; }

    // 4. NATURAL GLOW: radial gradients + a short luminous trail, ABOVE orange.
    function startGlow() {
        if (!glowRunning) { glowRunning = true; raf(paintGlow); }
    }
    function drawHalo(p, alpha, radius) {
        var g = glowCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);
        g.addColorStop(0, 'rgba(255,255,230,' + alpha + ')');
        g.addColorStop(0.16, 'rgba(255,246,165,' + alpha*0.85 + ')');
        g.addColorStop(0.46, 'rgba(' + config.glowColor + ',' + alpha*0.37 + ')');
        g.addColorStop(1, 'rgba(' + config.glowColor + ',0)');
        glowCtx.fillStyle = g;
        glowCtx.fillRect(p.x-radius,p.y-radius,radius*2,radius*2);
    }
    function paintGlow() {
        if (disposed) { glowRunning = false; return; }
        var now = Date.now(), n, age;
        glowCtx.setTransform(1,0,0,1,0,0);
        glowCtx.clearRect(0,0,glow.width,glow.height);
        glowCtx.setTransform(glowScale,0,0,glowScale,0,0);
        while (trail.length && now - trail[0].time > 500) { trail.shift(); }
        for (n = 0; n < trail.length; n += 1) {
            age = (now - trail[n].time) / 500;
            drawHalo(trail[n], (1-age) * (n === trail.length-1 ? 0.95 : 0.13), config.glowRadius);
        }
        if (complete && now - completedAt < config.videoDelay) {
            // Soft celebration glow along the finished curve during the 3-second wait.
            var remaining = Math.max(0, config.videoDelay - (now - completedAt));
            var fade = Math.min(1, remaining / 700);
            var alpha = (0.13 + 0.04 * Math.sin((now-completedAt)/220)) * fade;
            for (n = 0; n < points.length; n += 12) { drawHalo(points[n], alpha, config.glowRadius*1.25); }
        }
        if (trail.length || (complete && now-completedAt < config.videoDelay)) { raf(paintGlow); }
        else { glowRunning = false; }
    }

    // 5. SIMPLE COMPLETION FUNCTIONS. Add your own actions here.
    function finishSmile() {
        if (complete) { return; }
        complete = true;
        completedAt = Date.now();
        stopDrawing();
        // All sections were traced: show the final image without clip seams.
        ctx.clearRect(box.x - 2.5, box.y - 2.5, box.width + 5, box.height + 5);
        drawOrangeImage();
        gray.style.visibility = 'hidden';
        instruction.textContent = 'Smile complete!';
        replayButton.style.display = 'none'; //hide replay even after smile is traced
        startGlow();
        prepareVideoFrame();
        window.onSmileComplete();
    }
    window.onSmileComplete = function onSmileCompleteHandler() {
        // Trigger the audio and blocker 100ms after tracing completes.
        completionActionTimer = window.setTimeout(function () {
            completionActionTimer = null;
            if (!complete) { return; }
            var intro = getElement('intro');
            var blocker = getElement('blocker');
            if (intro) {
                var introResult = intro.play();
                if (introResult && introResult.catch) { introResult.catch(function () {}); }
            }
            if (blocker) { blocker.style.display = 'block'; }
        }, 100);
        timer = window.setTimeout(startCompletionVideo, config.videoDelay);
    };
    // Blend to the ACTUAL first frame while the video remains paused at 0.
    // This absorbs small artwork differences during the existing three-second wait.
    // Starting playback then extends that exact same frame, without a page swap.
    function prepareVideoFrame() {
        if (disposed) { return; }
        if (!complete || videoFrameVisible || video.readyState < 2 || video.error) { return; }
        videoFrameVisible = true;
        var thisRun = runId;
        videoLayer.style.display = 'block';
        // Two paint opportunities let CSS blend from transparent to the decoded frame.
        raf(function () {
            raf(function () {
                if (thisRun === runId && complete) { videoLayer.style.opacity = '1'; }
            });
        });
    }
    video.addEventListener('loadeddata', prepareVideoFrame, false);
    video.addEventListener('canplay', prepareVideoFrame, false);

    function playVideo() {
        video.muted = false;
        video.defaultMuted = false;
        video.removeAttribute('muted');
        video.volume = 1;
        try {
            var result = video.play();
            if (result && result.catch) {
                result.catch(function () {
                    // Browser autoplay restrictions cannot be bypassed without user activation.
                });
            }
        } catch (ignore) { /* Browser may block unmuted autoplay. */ }
    }
    function startCompletionVideo() {
        if (disposed) { return; }
        timer = null;
        if (!complete) { return; }
        // Keep the game visible if decoding is slow. Never show an empty black layer.
        prepareVideoFrame();
        playVideo();
    }
    video.addEventListener('playing', function () {
        if (!complete) { video.pause(); return; }
        prepareVideoFrame();
        replayButton.style.display = 'none';
    }, false);
    video.addEventListener('ended', function () { replayButton.style.display = 'block'; }, false);
    video.addEventListener('error', function () {
        // No manual playback controls are displayed.
    }, false);

    window.resetSmileGame = function resetSmileGameHandler() {
        runId += 1;
        if (timer !== null) { window.clearTimeout(timer); timer = null; }
        if (completionActionTimer !== null) { window.clearTimeout(completionActionTimer); completionActionTimer = null; }
        stopDrawing(); complete = false; covered = 0; trail = [];
        videoFrameVisible = false;
        videoLayer.style.opacity = '0';
        for (var n = 0; n < visited.length; n += 1) { visited[n] = false; }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        glowCtx.setTransform(1,0,0,1,0,0); glowCtx.clearRect(0,0,glow.width,glow.height);
        gray.style.visibility = 'visible';
        video.pause();
        try { video.currentTime = 0; } catch (ignore) { /* Not loaded yet. */ }
        videoLayer.style.display = 'none';
        replayButton.style.display = 'none';
        var blocker = getElement('blocker');
        if (blocker) { blocker.style.display = 'none'; }
        var intro = getElement('intro');
        if (intro) { intro.pause(); try { intro.currentTime = 0; } catch (ignore) {} }
        instruction.textContent = 'Trace the gray smile with your finger';
    };
    replayButton.onclick = window.resetSmileGame;

    // 6. INPUT: pointer events, plus older touch/mouse fallbacks. One finger only.
    if (window.PointerEvent) {
        canvas.addEventListener('pointerdown', function (e) {
            if (pointerId !== null || (e.pointerType === 'mouse' && e.button !== 0)) { return; }
            e.preventDefault(); pointerId = e.pointerId;
            if (canvas.setPointerCapture) { canvas.setPointerCapture(e.pointerId); }
            begin(pointerPosition(e));
        }, false);
        canvas.addEventListener('pointermove', function (e) {
            if (e.pointerId !== pointerId) { return; }
            e.preventDefault();
            var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            if (!list.length) { list = [e]; }
            for (var n = 0; n < list.length; n += 1) { move(pointerPosition(list[n])); }
        }, false);
        function pointerEnd(e) { if (e.pointerId === pointerId) { stopDrawing(); } }
        onGlobal(window, 'pointerup', pointerEnd, false);
        onGlobal(window, 'pointercancel', pointerEnd, false);
        canvas.addEventListener('lostpointercapture', pointerEnd, false);
    } else {
        var touchOptions = false;
        try {
            var options = Object.defineProperty({}, 'passive', {get: function () { touchOptions = {passive:false}; }});
            window.addEventListener('options-test', stopDrawing, options);
            window.removeEventListener('options-test', stopDrawing, options);
        } catch (ignore) { /* Older Safari accepts only a boolean listener option. */ }
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault(); lastTouch = Date.now();
            if (pointerId !== null) { return; }
            var touch = e.changedTouches[0]; pointerId = touch.identifier;
            begin(pointerPosition(touch));
        }, touchOptions);
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            for (var n = 0; n < e.changedTouches.length; n += 1) {
                if (e.changedTouches[n].identifier === pointerId) { move(pointerPosition(e.changedTouches[n])); }
            }
        }, touchOptions);
        function touchEnd(e) {
            for (var n = 0; n < e.changedTouches.length; n += 1) {
                if (e.changedTouches[n].identifier === pointerId) { stopDrawing(); }
            }
        }
        onGlobal(window, 'touchend', touchEnd, false);
        onGlobal(window, 'touchcancel', touchEnd, false);
        canvas.addEventListener('mousedown', function (e) {
            if (e.button === 0 && Date.now()-lastTouch > 800) { e.preventDefault(); begin(pointerPosition(e)); }
        }, false);
        onGlobal(window, 'mousemove', function (e) { move(pointerPosition(e)); }, false);
        onGlobal(window, 'mouseup', stopDrawing, false);
    }
    onGlobal(window, 'blur', stopDrawing, false);
    onGlobal(document, 'visibilitychange', function () { if (document.hidden) { stopDrawing(); } }, false);
}

$(document).ready(function () { initializeSmileGame(); });
