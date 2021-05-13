#!/usr/bin/env python3
"""
A very quick and dirty script to covert a .pcm file to a wav.

Usage:
    python3 covertpcmtowav.py <filename.pcm>[ <filename.pcm> ...]

Each input .pcm file will have a new .wav file generated with the same name with .wav
appended.
"""

import sys
import struct
import wave

WAV_SPECS = (1, 2, 48000, 0, "NONE", "NONE")

for srcfn in sys.argv[1:]:
    dstfn = srcfn + ".wav"
    print(f"Converting: {srcfn} > {dstfn}")

    pcmfh = open(srcfn, "rb")
    wavfh = wave.open(dstfn, "wb")
    wavfh.setparams(WAV_SPECS)

    srcdata = pcmfh.read()
    data = b""

    unpstr = "<{:.0f}h".format(len(srcdata) / 2)
    srcdata = struct.unpack(unpstr, srcdata)
    pstr = "<{:.0f}h".format(len(srcdata) / 2)
    srcdata = srcdata[::2]
    data = struct.pack(pstr, *srcdata)

    wavfh.writeframes(data)
