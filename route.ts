const osc = require("osc");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create /music directory if not exists
const musicDir = path.join(__dirname, "public");
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir);

// Read music.json file (make sure to place the music.json in the correct directory)
const musicData = JSON.parse(fs.readFileSync("music.json", "utf8"));

// Setup readline interface to prompt user for mood and genre
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt user for mood and genre selection
const askQuestions = () => {
  rl.question(
    "Please select a mood (Happy, Chill, Energetic, Relaxed): ",
    (mood) => {
      rl.question(
        "Please select a genre (EDM, Jazz, Pop, Classical, Rock, Funk, Ambient): ",
        (genre) => {
          // Filter the songs based on mood and genre
          const selectedSong = musicData.songs.find(
            (song) =>
              song.mood.toLowerCase() === mood.toLowerCase() &&
              song.genre.toLowerCase() === genre.toLowerCase()
          );

          if (!selectedSong) {
            console.log("❌ No song found for the selected mood and genre.");
            rl.close();
            return;
          }

          console.log(
            `🎵 Song found! Mood: ${selectedSong.mood}, Genre: ${selectedSong.genre}`
          );

          // Now calculate the sleep duration based on the song duration
          const audioDuration = selectedSong.duration; // Assuming the duration is available in seconds
          const sleepDuration = 15; // Add 1 second to the duration

          // Now send this song's code to Sonic Pi via OSC
          const udpPort = new osc.UDPPort({
            localAddress: "127.0.0.1",
            localPort: 4558, // Listen for responses
            remoteAddress: "127.0.0.1",
            remotePort: 4560, // Sonic Pi's OSC port
          });

          // Open the port
          udpPort.open();

          udpPort.on("ready", () => {
            console.log("✅ Listening for OSC messages on port 4558...");

            // Send the dynamic code to Sonic Pi to start recording
            udpPort.send(
              {
                address: "/trigger/code", // Send the code via OSC
                args: [selectedSong.code, sleepDuration], // Include the calculated sleep duration
              },
              "127.0.0.1",
              4560
            );

            console.log("🚀 Sent dynamic code to Sonic Pi!");

            // Listen for the recorded file path
            udpPort.on("message", (oscMessage) => {
              if (oscMessage.address === "/recorded-files") {
                const sonicPiPath = oscMessage.args[0].replace(
                  "~",
                  process.env.HOME
                ); // Resolve ~ to absolute path

                // Generate file name based on genre and mood without a timestamp
                const newFileName = `${mood.toLowerCase()}_${genre.toLowerCase()}.wav`; // Simplified filename
                const newPath = path.join(musicDir, newFileName); // Save to /public/music directory

                // Copy the new recording file from Sonic Pi's path to /music
                fs.copyFile(sonicPiPath, newPath, (err) => {
                  if (err) {
                    console.error("❌ Error saving file:", err);
                  } else {
                    console.log(`✅ Saved new recording as: ${newPath}`);
                  }
                });
              }
            });
          });

          rl.close();
        }
      );
    }
  );
};

askQuestions();
