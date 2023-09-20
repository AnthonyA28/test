# Plotter 

## Running

To run the program, have node installed and then install the dependencies of the program with 

```bash
npm install 
```

Then run the program with 

```bash
npm run start 
```



### Issues

Issue of "GPU process isn't usable. Goodbye." is solved by adding to main.js

```javascript
app.commandLine.appendSwitch('in-process-gpu');
```

