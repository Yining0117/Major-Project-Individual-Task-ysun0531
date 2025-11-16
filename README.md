## Dancing Apple Tree in a Thunderstorm
### 1 How to interact with the work
1. Open the project in a browser.
2. Click "Play / Pause" to play pr pause the music.
3. Click "music1" can switch the song to "Music 2", and click it again can switch back to "music1".
4. Move the mouse up and down to control the volume.
5. press the "space" to switch the direction of gravity(up or down).

The interface's response is as follows: 

When no buttons are clicked, apples randomly appear on the 3rd to 4th level branches. After waiting for 2 seconds, they fall down, remain stationary on the ground for 2 seconds, and then return to the tree to start the next cycle. 
If the space bar is pressed, the apple will immediately return to the branch and wait for 2 seconds before falling upwards. If the space bar is pressed again, the apple will immediately return to the branch and fall downwards after 2 seconds. 
Click the "play/pause" button to start playing music1. Click "music1" to switch the song to "music2", and vice versa to switch back to music1. When you move the mouse up in the interface, the music volume increases; when you move it down, the music volume decreases. The background color, the size of the apple, and the length of the "raindrops" will change along with the music. At this point, click the "play/pause" button to stop the music and the animation.

### 2 Details of my individual approach
#### 2.1 Divison of labor 
My individual task is about **AUDIO**.
#### 2.2 The unique from other group menbers
I mainly changed the size of the apple, the background color and the noise in the background.

Apple: I changed the size of the apple, making it change size along with the music.

Background color: The background color changes along with the music. Here, I chose a brighter blue color, so in the actual effect, it looks more like "lightning".

Noise points: I changed the direction of the noise, tilting the horizontal noise by 80° to imitate "rain", and I also made the length of the noise change along with the music to imitate the visual effect of rain.
#### 2.3 Inspiration
My inspiration comes from many works of art. Below, I will introduce some of the main sources of inspiration.
1. Singin' in the Rain
"Singin 'in the Rain" is a classic 1952 musical film that tells the story of Hollywood's transition from the silent film era to the sound film era. The scene where the protagonist danced in the rain left a deep impression on me. This reminds me of my love for life and freedom. Inspired by this, I thought of the scene where apple trees were "dancing" in the heavy rain.

![an example](Assets/sining%in%the%rain.png)


2.

#### 2.4 Technical explanation of my individual code
2.4.1 Audio setup with p5.js

I use the `p5.Sound` library (which is not part of the core p5.js but an official extension).

In `preload()` I load two audio files:

```js
  function preload(){
    song1 = loadSound("Assets/Hip-hop-02-738.mp3");
    song2 = loadSound("Assets/hazy-after-hours-132.mp3");
  }
```
In setup() I set currentSong = song1 and create an amplitude analyser:
```js
currentSong = song1;
analyser = new p5.Amplitude();
analyser.setInput(currentSong);
```

2.4.2 Play/Pause and volume control

At first, I created the button and then set the style for it to maintain visual consistency.

```js
let button = createButton("Play/Pause");
button.position(25,15);
button.mousePressed(PlayPause);
button.style("font-size","20px");
button.style("padding","5px 10px");
```

Then I added the `playPause()` function to control the switching of songs.

```js
function PlayPause(){
  if (!currentSong) return;

  if (currentSong.isPlaying()){
    currentSong.stop();
  } else {
    currentSong.loop();
    currentSong.setVolume(volume); 
  }
}
```

In `draw()`, when the song is playing, vertical mouse position controls the volume:

```js
if (currentSong && currentSong.isPlaying()) {
  volume = map(mouseY, height, 0, 0, 1, true);
  currentSong.setVolume(volume);
}
```

2.4.3 Audio reaction of apples

The amplitude is smoothed with lerp to avoid jitter:

```js
let levelNow = analyser.getLevel();
LevelSmoothed = lerp(LevelSmoothed, levelNow, 0.2);
appleScale = map(LevelSmoothed, 0, 0.3, 0.9, 1.8, true);
```

2.4.4 Audio reaction of "rain" (noisePoints)

The background “rain” is stored as an array of `noisePoints`, each with a position and colour.

In `draw()`, their lengths are mapped to the current amplitude:

```js
let noiceLevel = analyser.getLevel();                     
let lineScale = map(noiceLevel, 0, 0.4, 100, 200);         
let angle = radians(80);

for (let p of noisePoints){
  stroke(p.c[0], p.c[1], p.c[2], p.c[3]);
  strokeWeight(2);

  let len = lineScale;
  let x2 = p.x + cos(angle) * len;
  let y2 = p.y + sin(angle) * len;

  line(p.x, p.y, x2, y2);
}
```

2.4.5 Colour change of Background

I used map to add an other blue in the original color.

```js
let level = analyser ? analyser.getLevel() : 0;
bgPulse = lerp(bgPulse, level, 0.1); 
let t = constrain(map(bgPulse, 0, 0.3, 0, 1), 0, 1) * 1.5; 

let baseCol = color(60, 80, 120);
let peakCol = color(80, 110, 160);
let bgCol = lerpColor(baseCol, peakCol, t);
background(bgCol);
```

## 3 Reference
### 3.1 Code reference 
[constrain()](https://p5js.org/reference/p5/constrain/)

[lerpColor()](https://p5js.org/reference/p5/lerpColor/)


### 3.2 Resource of music
Music1: Hip Hop 02 
Music2: Hazy After Hours

All the music is from the free music website [mixkit](https://mixkit.co/free-stock-music/).

## 4 Appendix

### ChatGPT Q & A about creating the musci switch button
This appendix documents the conversation with ChatGPT that helped me implement the **music-switching button** in my interactive artwork.

Since the original version was not asked in English, here I have placed a summary of the translated dialogue process to clarify my use of AI.

Q1 — Me 

I want to add a second button below the Play/Pause button to switch between two songs.  
I added a file named *hazy-after-hours-132.mp3* inside the Assets folder.
I want the button to display **“music1”**, and when clicked it switches to the next song and changes to **“music2”**.  
The original Play/Pause button should continue to control only play/pause.
How can I implement this?

A1 — ChatGPT 

To implement a music-switch button, you need:

1. Two sound variables (`song1`, `song2`)
2. A variable to keep track of which song is currently selected (`currentSong`)
3. A new button (`changeMusicButton`)
4. A function to switch songs and update the Amplitude analyzer

Below is the code you should add:

```js
let song1, song2, currentSong;
let changeMusicButton;

function preload() {
  song1 = loadSound("Assets/Hip-hop-02-738.mp3");
  song2 = loadSound("Assets/hazy-after-hours-132.mp3");
}

function setup() {
  currentSong = song1;

  analyser = new p5.Amplitude();
  analyser.setInput(currentSong);

  changeMusicButton = createButton("music 1");
  changeMusicButton.position(25, 60);
  changeMusicButton.mousePressed(changeMusic);
}

function changeMusic() {
  let wasPlaying = currentSong.isPlaying();

  song1.stop();
  song2.stop();

  if (currentSong === song1) {
    currentSong = song2;
    changeMusicButton.html("music 2");
  } else {
    currentSong = song1;
    changeMusicButton.html("music 1");
  }

  analyser.setInput(currentSong);

  if (wasPlaying) {
    currentSong.loop();
    currentSong.setVolume(volume);
  }
}
```

Q2 — Me

I get this error:
Uncaught TypeError: changeMusic.html is not a function

A2 — ChatGPT

This error occurs because you wrote:
changeMusic.html(...)


Instead of:
changeMusicButton.html(...)


changeMusic is a function, not a button.
Only the button object supports .html().

Changing it to:
changeMusicButton.html("music 2");


will fix the error.

Q3 — Me

After switching songs, the amplitude-reactive animations stopped working.
The background and apples no longer respond to music. Why?

A3 — ChatGPT

This happens because the amplitude analyzer was still listening to the old song.
You must update the analyzer input:
```js
analyser.setInput(currentSong);
```
This line must run after switching currentSong.

Q4 — Me

How do I make sure the volume continues working after switching songs?

A4 — ChatGPT

After switching songs, you should restore the previous volume:

```js
if (wasPlaying) {
  currentSong.loop();
  currentSong.setVolume(volume);
}
```

