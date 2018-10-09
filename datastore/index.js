const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFileAsync = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    // items[id] = text;
    var newTodoPath = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(newTodoPath, text, (err) => {
      if (err) { 
        throw ('file failed to write');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files = []) => {
    if (err) {
      return callback(err);
    }
    var data = _.map(files, (filepath) => {
      var id = path.basename(filepath, '.txt');
      return readFileAsync(path.join(exports.dataDir, filepath))
        .then((text) => {
          return {id, text: text.toString()};
        })
        .catch((err) => {
          return callback(err);
        })
    });
    
    Promise.all(data)
      .then((data) => {
        callback(null, data);
      });
  });
};

exports.readOne = (id, callback) => {
  var todoFilePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(todoFilePath, 'utf8', (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text});
    }
  });
  
};

exports.update = (id, text, callback) => {  
  var todoFilePath = path.join(exports.dataDir, id + '.txt');
  fs.stat(todoFilePath, (err, stats) => {
    if (!err) {
      fs.writeFile(todoFilePath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {id, text});
        }
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.delete = (id, callback) => {
  var todoFilePath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(todoFilePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
