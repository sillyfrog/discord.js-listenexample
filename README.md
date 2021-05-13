# discord.js-listenexample
An example script to show discord.js listening to audio

You will need to create an `auth.json` file for your bot, it should contain:
```
{
    "token": "<TOKEN>",
    "name": "<BOT_NAME>"
}
```

Then build the Dockerfile:
```
docker build . -t listendemo
```

Then run and connect to the container:
```
docker run -ti listendemo bash
```

And now run the demo:
```
node demo.js ./auth.json <your channel id>
```

The script will output what is happening, including start and stop speaking events.

A .pcm file will also be generated for each speaker each time they speak. I have included a `convertpcmtowav.py` python script to convert the generated .pcm files to .wav files. See the header for more information.