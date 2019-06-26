'use strict';
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// Make the console output a bit prettier
const Spinner = require('cli-spinner').Spinner;
const { red, blue, bold, underline } = require("colorette")

const appName = process.argv.slice(2)[0];
const appKind = process.argv.slice(2)[1] !== "--app";
let appDirectory = `${process.cwd()}/${appName}`

let kind = appKind ? "vf-eleventy" : "stencil-app-starter";

const run = async () => {
  console.log(underline(`\nGetting started! 💎 ${kind}`))

  let success = await createStencilApp()
  if (!success) {
    console.log(`\n😭  Something went wrong when initing ${kind}`)
    console.log(`\n⚠️  Tip: Make sure the directory "${appName}" does not already exsist.\n`)
    return false;
  } else {
    await cdIntoNewApp()
    await installPackages()
    console.log(bold("\n🎉  All done!\n"))
  }
}

const createStencilApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      try {
        exec(`git clone https://github.com/visual-framework/${kind} "${appName}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`\n⚠️  Couldn't check out ${kind} into "${appName}"`)
            resolve(false)
          } else {
            console.log(`\nCloned Visual Frameork ${kind} into "${appName}"`)
            resolve(true)
          }
        })
      } catch(e) {
        console.log(`\nCouldn't check out ${kind} into "${appName}"`)
        resolve(false)
      }
    } else {
      console.log("\nNo app name was provided.")
      console.log("\nProvide an app name in the following format: ")
      console.log("\nnpm init vf-eleventy", `"app-name"\n`)
        resolve(false)
    }
  })
}

const cdIntoNewApp = () => {
  return new Promise((resolve) => {
    console.log(`\n🧭  Switching to the ./${appName} directory.`)
    process.chdir(`${appName}`);
    resolve()
  })
}

const installPackages = () => {
  return new Promise((resolve) => {
    // console.log("\n📦  Installing packages...")
    var spinner = new Spinner('📦  Installing packages... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    exec(`npm install --save`, () => {
      spinner.stop();
      resolve()
    })
  })
}

run();
