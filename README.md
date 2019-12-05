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
docker build . -t demo
```

Then run and connect to the container:
```
docker run -ti demo bash
```

And now run the demo:
```
node demo.js ./auth.json <your channel id>
```
