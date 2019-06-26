#!/usr/bin/env node

'use strict';
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// Make the console output a bit prettier
const ora = require('ora');
const cliSpinners = require('cli-spinners');
const { red, blue, bold, underline } = require("colorette")

const appName = process.argv.slice(2)[0];
const appKind = process.argv.slice(2)[1] !== "--app";
let appDirectory = `${process.cwd()}/${appName}`

// for now we only support vf-eleventy
let kind = appKind ? "vf-eleventy" : "vf-eleventy";

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
    console.log(`\n⌨️  You're now ready to develop:`)
    console.log(`    1. cd ${appName}`)
    console.log(`    2. gulp dev`)
  }
}

const createStencilApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      try {
        exec(`git clone --depth 1 -b master https://github.com/visual-framework/${kind} "${appName}"`, (error, stdout, stderr) => {
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
      console.log("\nnpm init @visual-framework/vf-eleventy", `"app-name"\n`)
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
    const spinner = new ora({
      prefixText: '📦 ',
    	text: 'Installing packages',
      // indent: 2,
    	spinner: 'pong'
    });

    setTimeout(() => {
      spinner.text = 'Installing packages (this may take some time)';
    	spinner.color = 'yellow';
    }, 5000);


    // https://github.com/sindresorhus/ora
    spinner.start();
    exec(`yarn install --save`, () => {
      spinner.succeed();
      resolve()
    })
  })
}

run();
