#!/usr/bin/env node

'use strict';
const fs = require('fs');
const path = require('path');
const mv = require('mv');
const del = require('delete');
const symlinkDir = require('symlink-dir')
const exec = require('child_process').exec;
const download = require('download');
const unzipper = require('unzipper');

// Make the console output a bit prettier
const ora = require('ora');
const cliSpinners = require('cli-spinners');
const { red, blue, bold, underline } = require("colorette")

const appName = process.argv.slice(2)[0];
const appKind = process.argv.slice(2)[1];
let appDirectory = `${process.cwd()}/${appName}`

// Some reusable url, filenames
let locations = {
  zipName: 'source.zip',
  tempLocation: 'temp',
  zipFolderStem: 'notYetSet',
  vfEleventy: 'https://github.com/visual-framework/vf-eleventy/archive/v2.0.0-alpha.6.zip',
  vfDemoDesignSystem: 'tocome'
}

// default to vf-eleventy
let kind = appKind ? "vf-eleventy" : "vf-eleventy";

const run = async () => {
  console.log(` --------------\n`)
  console.log(bold(`\n🚧  Getting started!\n`))

  let success = await createApp()
  if (!success) {
    console.log(`\n😭  Something went wrong when initing ${kind}`)
    console.log(`\n⚠️  Tip: Make sure the directory "${appName}" does not already exsist.\n`)
    return false;
  } else {
    await unzipArchive()
    await moveFiles()
    await cdIntoNewApp()
    await installPackages()
    await restoreSymLink()
    console.log(bold("🎉  All done!\n"))
    console.log(`⌨️   You're now ready to develop:`)
    console.log(`      1. cd ${appName}`)
    console.log(`      2. gulp dev\n`)
    console.log(` --------------\n`)
  }
}

const createApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      try {
        const spinner = new ora({
          prefixText: '🌍 ',
        	text: 'Fetching ' + locations.vfEleventy,
          // indent: 2,
        	// spinner: 'pong'
        });


        download(locations.vfEleventy).then(data => {
          fs.writeFileSync(locations.zipName, data);
          resolve(true)
          spinner.text = 'Fetched ' + locations.vfEleventy;
          spinner.succeed();
        });

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

    // tap into the zip to see the parent folder name
    fs.createReadStream(locations.zipName)
      .pipe(unzipper.ParseOne('README.md'))
      .on('entry', function (entry) {
        locations.zipFolderStem = entry.path.split('/')[0];
        entry.autodrain();
      });

    // extract contents to temp location
    fs.createReadStream(locations.zipName)
      .pipe(unzipper.Extract({ path: locations.tempLocation }))
      // .pipe(unzipper.Parse())
      // .on('entry', entry => entry.autodrain())
      .on('entry', function (entry) {
        const fileName = entry.path;
        const type = entry.type; // 'Directory' or 'File'
        const size = entry.vars.uncompressedSize; // There is also compressedSize;
        entry.autodrain();
      })
      .promise()
      .then( () => resolve(), e => console.log('⚠️  Error unzipping',e));
  });
}


const moveFiles = () => {
  return new Promise((resolve) => {
    del([locations.zipName], function(err, deleted) {
      if (err) throw err;
    });
    console.log('te', locations.zipFolderStem);
    mv(locations.tempLocation+'/'+locations.zipFolderStem, appName, {mkdirp: true}, function(err) {
      console.log(`🚚  Files unpacked and moved into ./${appName}`)
      resolve()
    });
  })
}

const cdIntoNewApp = () => {
  return new Promise((resolve) => {
    console.log(`🗺   Switching to the ./${appName} directory`)
    process.chdir(`${appName}`);
    resolve()
  })
}

const installPackages = () => {
  return new Promise((resolve) => {

    // remove the defunct symlink
    del(['src/components/vf-core-components'], function(err, deleted) {
      if (err) throw err;
      // deleted files
      // console.log(deleted);
    });

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
    exec(`yarn install`, () => {
      spinner.succeed();
      resolve()
    })
  })
}

// restore a symlink from src/vf-components/vf-core-components to node_modules/@visual-framework/vf-core/components
const restoreSymLink = () => {
  return new Promise((resolve) => {
    symlinkDir('node_modules/\@visual-framework', 'src/components/vf-core-components')
      .then(result => {
        // console.log(result)

        resolve()

        return symlinkDir('node_modules/\@visual-framework', 'src/components/vf-core-components')

      })
      .catch(err => console.error(err))
    // console.log(`🗺  Switching to the ./${appName} directory`)
    // process.chdir(`${appName}`);
  })
}

run();
