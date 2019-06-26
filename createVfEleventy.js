#!/usr/bin/env node

'use strict';
const fs = require('fs');
const path = require('path');
const mv = require('mv');
const del = require('delete');
const exec = require('child_process').exec;
const download = require('download');
const unzipper = require('unzipper');

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
  console.log(` --------------\n`)
  console.log(bold(`\n🚧  Getting started!\n`))

  let success = await createStencilApp()
  if (!success) {
    console.log(`\n😭  Something went wrong when initing ${kind}`)
    console.log(`\n⚠️  Tip: Make sure the directory "${appName}" does not already exsist.\n`)
    return false;
  } else {
    await unzipArchive()
    await moveFiles()
    await cdIntoNewApp()
    await installPackages()
    console.log(bold("🎉  All done!\n"))
    console.log(`⌨️   You're now ready to develop:`)
    console.log(`      1. cd ${appName}`)
    console.log(`      2. gulp dev\n`)
    console.log(` --------------\n`)
  }
}

const createStencilApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      try {
        const spinner = new ora({
          prefixText: '🌍 ',
        	text: 'Fetching https://github.com/visual-framework/vf-eleventy/archive/v2.0.0-alpha.1.zip',
          // indent: 2,
        	// spinner: 'pong'
        });


        download('https://github.com/visual-framework/vf-eleventy/archive/v2.0.0-alpha.1.zip').then(data => {
          fs.writeFileSync('vf-eleventy.zip', data);
          resolve(true)
          spinner.text = 'Fetched https://github.com/visual-framework/vf-eleventy/archive/v2.0.0-alpha.1.zip';
          spinner.succeed();
        });

        //
        // exec(`git clone --depth 1 -b master https://github.com/visual-framework/${kind} "${appName}"`, (error, stdout, stderr) => {
        //   if (error) {
        //     resolve(false)
        //   } else {
        //     console.log(`\n✨  Cloned ${kind} into "${appName}"`)
        //     resolve(true)
        //   }
        // })
      } catch(e) {
        console.error(`\n⚠️  Couldn't get archive of ${kind}"`)
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

const unzipArchive = () => {
  return new Promise((resolve) => {
    fs.createReadStream('vf-eleventy.zip')
      .pipe(unzipper.Extract({ path: 'temp' }))
      .on('entry', entry => entry.autodrain())
      .promise()
      .then( () => resolve(), e => console.log('⚠️  Error unzipping',e));
  })
}


const moveFiles = () => {
  return new Promise((resolve) => {
    del(['vf-eleventy.zip'], function(err, deleted) {
      if (err) throw err;
      // deleted files
      // console.log(deleted);
    });

    mv('temp/vf-eleventy-2.0.0-alpha.1', appName, {mkdirp: true}, function(err) {
      console.log(`🚚  Files unpacked and moved into ./${appName}`)
      resolve()
    });
  })
}

const cdIntoNewApp = () => {
  return new Promise((resolve) => {
    console.log(`🗺  Switching to the ./${appName} directory`)
    process.chdir(`${appName}`);
    resolve()
  })
}

const installPackages = () => {
  return new Promise((resolve) => {
    const spinner = new ora({
      prefixText: '📦 ',
    	text: 'yarn install-ing packages',
      // indent: 2,
    	spinner: 'pong'
    });

    setTimeout(() => {
      spinner.text = 'yarn install (this may take some time)';
    	// spinner.color = 'yellow';
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
