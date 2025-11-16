## Dancing Apple Tree in a Thunderstorm
### 1 How to interact with the work.
1. Open the project in a browser.
2. Click "Play / Pause" to play pr pause the music.
3. Click "music1" can switch the song to "Music 2", and click it again can switch back to "music1".
4. Move the mouse up and down to control the volume.
5. press the "space" to switch the direction of gravity(up or down).

The interface's response is as follows: 

When no buttons are clicked, apples randomly appear on the 3rd to 4th level branches. After waiting for 2 seconds, they fall down, remain stationary on the ground for 2 seconds, and then return to the tree to start the next cycle. 
If the space bar is pressed, the apple will immediately return to the branch and wait for 2 seconds before falling upwards. If the space bar is pressed again, the apple will immediately return to the branch and fall downwards after 2 seconds. 
Click the "play/pause" button to start playing music1. Click "music1" to switch the song to "music2", and vice versa to switch back to music1. When you move the mouse up in the interface, the music volume increases; when you move it down, the music volume decreases. The background color, the size of the apple, and the length of the "raindrops" will change along with the music. At this point, click the "play/pause" button to stop the music and the animation.

### 2 Details of my individual approach.
#### 2.1 Divison of labor: My individual task is about AUDIO.
#### 2.2 The unique from other group menbers
I mainly changed the size of the apple, the background color and the noise in the background.

Apple: I changed the size of the apple, making it change size along with the music.

Background color: The background color changes along with the music. Here, I chose a brighter blue color, so in the actual effect, it looks more like "lightning".

Noise points: I changed the direction of the noise, tilting the horizontal noise by 80° to imitate "rain", and I also made the length of the noise change along with the music to imitate the visual effect of rain.


## Appendix
### A-ChatGpt Q & A about creating the musci switch button.
# Appendix A — ChatGPT Q&A About Creating the Music Switch Button
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

analyser.setInput(currentSong);

This line must run after switching currentSong.

Q4 — Me

How do I make sure the volume continues working after switching songs?

A4 — ChatGPT

After switching songs, you should restore the previous volume:

if (wasPlaying) {
  currentSong.loop();
  currentSong.setVolume(volume);
}


Without this, the new track plays at full volume by default.

