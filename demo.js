// Call with someting like:
// node demo.js  ./auth.json <channel-id>
/*
auth.json file needs:

{
    "token": "<TOKEN>",
    "name": "<BOT_NAME>"
}

*/
const MSG_CHANNEL = '';

const Discord = require("discord.js");
const fs = require('fs');

console.log("Scribe: process.argv:", process.argv);
const configfn = process.argv[2];
const channelid = process.argv[3];
console.log(`Scribe: Config filename: ${configfn}  Channel ID: ${channelid}`);

const client = new Discord.Client();

const config = require(configfn);

let dispatcher;

let voicechannel;

let myid = null;

let seenUsers = new Set();

// make a new stream for each time someone starts to talk
function generateOutputFile(channel, member) {
    const fileName = `recordings/${channelid}-${member.username}-${Date.now()}.pcm`;
    console.log(fileName);
    return fs.createWriteStream(fileName);
}

function thenJoinVoiceChannel(conn) {
    console.log(`Scribe: ready: ${conn.channel.name}!`);
    // create our voice receiver
    const receiver = conn.receiver;

    // Must play a sound over the channel otherwise incoming voice data is empty
    console.log('Scribe: Play join.mp3...');
    dispatcher = conn.play('/app/join.mp3', { passes: 5 });
    dispatcher.on('start', () => {
        console.log('Scribe: Play Starting...');
    });
    dispatcher.on('finish', () => {
        console.log('Scribe: Finished playing!');
    });
    dispatcher.on("end", end => {
        console.log('Scribe: End Finished playing!');
    });

    conn.on('error', (error) => {
        console.log("conn Error!", error);
    });
    conn.on('failed', (error) => {
        console.log("conn Fail!", error);
    });
    conn.on('speaking', (user, speaking) => {
        console.log('Scribe: Current Members: ', conn.channel.members.size);
        console.log('Scribe: speaking: ', speaking);

        if (speaking.has('SPEAKING')) {
            //msg.channel.sendMessage(`I'm listening to ${user}`);
            console.log(`Scribe: listening to ${user.username}`);
            // console.log(`Scribe: CONN ${conn}`, conn);
            console.log(`Scribe: SPEAKING ${speaking}`, speaking);
            // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
            const audioStream = receiver.createStream(user, { mode: 'pcm' });
            //const audioStream = receiver.createStream(user, { mode: 'opus' });
            // create an output stream so we can dump our data in a file
            const outputStream = generateOutputFile(conn.channel, user);
            // pipe our audio data into the file stream
            //audioStream.on('data', (chunk) => {
            //    console.log(`Scribe: Received ${chunk.length} bytes of data.`);
            //});
            audioStream.pipe(outputStream);
            outputStream.on("data", console.log);
            // when the stream ends (the user stopped talking) tell the user
            audioStream.on('end', () => {
                //msg.channel.sendMessage(`I'm no longer listening to ${user}`);
                console.log(`Scribe: stop listening to ${user.username}`);
            });
        }
    });
}

function thingname(thing) {
    if (thing) {
        return thing.name;
    }
    return null;
}

client.on('voiceStateUpdate', (oldMember, newMember) => {
    console.log("voiceStateUpdate: oldChannel:", thingname(oldMember.channel));
    console.log("voiceStateUpdate: newChannel:", thingname(newMember.channel));

    if (oldMember.channel !== null) {
        if (oldMember.channel != voicechannel) {
            console.log("Scribe: Not something we care about, ignoring...");
        }
        else {
            console.log(`Scribe: Member left: ${oldMember.member.user.username}, remaining: ${oldMember.channel.members.size}`);
        }

    }
})

client.login(config.token);

client.on('ready', () => {
    console.log('Scribe: ready!');
    myid = client.user.id;

    console.log("ready Channels", client.channels);
    client.channels.fetch(channelid)
        .then(function (channel) {
            // Set the global
            voicechannel = channel;
            console.log("voice channel", voicechannel);
            console.log("Joining...");
            return voicechannel.join();
        })
        .then(thenJoinVoiceChannel);
});