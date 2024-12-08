### Issues faced
1. In fetch call for STT -> the formdata would be separate for audio files in expo android and expo web
2. In TTS -> some issues were there in the ecpo android, finally fixed by diving the video into chunks, etc
3. eas build errors in gradle -> Tried out a lot -> https://medium.com/@kaloraat/gradle-build-failed-with-unknown-error-3cf3884e2715 , expo doctor and much more but still had errors in gradle
4. In this case, i guess the error was -> first the error was may be because i didn't add eas.json, then windsurf recommended me to also install the latest versions of all the packages(which may be the main reason)

5. The error was fixed when i copied the package.json file code of the earlier commit i.e. before installing those latest versions
6. Also i switched to npm instead of pnpm -> to produce the package.lock.json instead of pnpm-lock.yaml