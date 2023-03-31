# TRUTHSHIELD

Truthshield is a mobile app that provides anti-corruption education and allows users to report incidents of corruption. The app is designed to empower individuals to take action against corruption by providing them with the knowledge and tools they need to identify and report corrupt practices.

## HOW TO RUN THE CODE
### PREREQUISITES
* Node.js: A JavaScript runtime that allows you to run JavaScript on your computer.
* Ionic CLI: A command-line interface that allows you to build and run Ionic applications. 
#### STEPS FOR INSTALLATION OF THE PROJECT
1. Clone the project form `https://github.com/nsengiyumva-wilberforce/truthshield.git`
```bash
git clone https://github.com/nsengiyumva-wilberforce/truthshield.git
```
2. Change the directory to the root of this project
```bash
cd truthshield
```
3. Run `npm install`
```bash
npm install
```
4.Serve the project
```bash
ionic serve -l
```
###### NB: The above previous command may ask you to install the ionic lab, please allow it.
5. The app will open in the browser.

<p>
When you run the app using the commands above, some functionalities will not work like `video recording`, `audio recording` because they are
using cordova plugin which run on a native plugin
</p>
<p>The following are the steps to generate an `apk` to run on the android device.<p>
<ol>
<p>Add the android platform
<li>
 <b>ionic cap add android</b>
</li>
</p>

<p>Build the project
<li>
 <b>ionic build</b>
</li>
</p>

<p>Run gradle to generate the apk
<li>
 <b>gradlew assembleDebug</b>
</li>
</p>


<p>Transfer the apk to the mobile app and install it
<li>
 <b>Get the apk from path/to/android/app/build/outputs/apk/debug</b>
</li>
</p>

</ol>
