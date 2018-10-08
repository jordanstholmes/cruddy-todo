const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  var data = [];
  // _.each(items, (text, id) => {
  //   data.push({ id, text });
  // });
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('directory not found [readAll]');
    } else {
      _.each(files, (file) => {
        var id = file.split('.')[0];
        // fs.readFile(file, (err, text) => {
        //   if (err) {
        //     throw ('failed to read file [readAll] ' + file);
        //   } else {
        //     data.push({id, text});
        //   }
        // });
        data.push({id, text: id});
      }); 
      callback(null, data);
    }
  });
  // 
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
