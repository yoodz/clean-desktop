#!/usr/bin/env node

var path = require("path");
var fs = require("fs");
var readlineSync = require('readline-sync');
var os = require('os');
let desktopPath = path.join(os.homedir(), 'Desktop')

let fileName = readlineSync.question('Please enter the file name(Archive): ');
if(!fileName){
  fileName = 'Archive'
}
let afterSort = desktopPath + path.sep + fileName

async function sort() {
  let exist = await getStat(afterSort)
  if (!exist) {
    await mkdir(afterSort)
  }
  let dirs = fs.readdirSync(desktopPath)

  dirs.forEach((item) => {
    let created = fs.readdirSync(afterSort)
    let fileType = fs.statSync(desktopPath + path.sep + item)
    if (fileType.isFile()) {
      if (item.indexOf('.') !== -1 && item.indexOf('.lnk') === -1) {
        let end = item.split('.')[1]
        let endPath = afterSort + path.sep + end
        if (!created.includes(end)) {
          fs.mkdirSync(endPath);
        }
        copyFile(desktopPath + path.sep + item, endPath + path.sep + item)
      }
    }
  })
}

// 复制文件
function copyFile(src, dist) {
  let rs = fs.createReadStream(src)
  rs.pipe(fs.createWriteStream(dist));
  rs.on('end', function () {
    //删除文件
    fs.unlink(src, function () {
      console.log('done');
    })
  })
}

function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    })
  })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

sort()
console.log('Finished')